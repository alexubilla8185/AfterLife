import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CreatorProfile, ConditionalResponse, Tribute, SocialLink, MemorialData } from '../types';
import { supabase } from '../services/supabaseClient';
import { useUser } from './useUser';

// Sample data to be seeded for the first user
const sampleProfileData = {
    name: 'Julia Hayes',
    life_span: '1968 - 2023',
    bio: 'An insatiable traveler, a captivating storyteller, and a devoted teacher. Julia believed the world was a classroom and every person a story waiting to be told. She collected moments, not things.',
    profile_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286de2?w=256&h=256&fit=crop&q=80',
};

const sampleResponsesData = [
    { keyword: 'miss you', response: 'The journey doesn\'t end here. Think of our time together as a beautiful chapter, not the whole story. The adventure continues, just in a different way.' },
    { keyword: 'travel', response: 'Ah, the open road! I hope you\'re still exploring. There\'s so much beauty to see. Don\'t ever lose your sense of wonder.' },
    { keyword: 'story', response: 'Every story we shared is a landmark on the map of my heart. Tell them often, and keep the pages turning.' },
    { keyword: 'sad', response: 'It\'s alright to feel lost sometimes. Every traveler needs a moment to rest. Remember the good trails we walked together, and let that be your guide.' },
    { keyword: 'learn', response: 'The best lesson I ever taught was to stay curious. Keep asking questions, keep seeking answers. The world is full of things to discover.' },
    { keyword: 'thank you', response: 'For walking this path with me for a while. It meant the world.' },
];

const sampleSocialLinksData = [
    { platform: 'Travel Blog', url: 'https://example.com' },
    { platform: 'Photography', url: 'https://example.com/photos' },
    { platform: 'Goodreads', url: 'https://goodreads.com/example' },
];

const sampleTributesData = [
    { author: 'Her former student, Anya', message: 'Ms. Hayes taught me more than just history; she taught me how to see the world. Her stories from her travels made every lesson an adventure. I\'ll carry her wisdom with me always.'},
    { author: 'Leo, her travel buddy', message: 'Julia, my friend, the trails are quieter without you. From the mountains of Peru to the markets of Marrakech, every step was a joy. Cheers to one last sunset. You are missed.'},
    { author: 'Her sister, Clara', message: 'My sister lived a dozen lifetimes in one. She sent postcards from every corner of the earth, each one filled with wonder. I\'ll miss her calls from faraway places. Rest easy, dear sister.'},
];


interface MemorialProfileContextType {
  memorial: MemorialData | null;
  loading: boolean;
  refetch: () => void;
  addConditionalResponse: (response: Omit<ConditionalResponse, 'id' | 'memorial_id'>) => Promise<void>;
  removeConditionalResponse: (id: string) => Promise<void>;
  addTribute: (tribute: Omit<Tribute, 'id' | 'memorial_id' | 'created_at'>) => Promise<void>;
  findResponseForMessage: (message: string) => ConditionalResponse | null;
  addSocialLink: (link: Omit<SocialLink, 'id' | 'memorial_id'>) => Promise<void>;
  removeSocialLink: (id: string) => Promise<void>;
}

const MemorialProfileContext = createContext<MemorialProfileContextType | undefined>(undefined);

export const MemorialProfileProvider: React.FC<{children: ReactNode, memorialId: string | null}> = ({ children, memorialId }) => {
  const [memorial, setMemorial] = useState<MemorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const seedInitialData = async (userId: string) => {
    console.log("No memorial found for user. Seeding initial data...");
    // 1. Create the memorial profile
    const { data: memorialData, error: memorialError } = await supabase
      .from('memorials')
      .insert({ ...sampleProfileData, user_id: userId })
      .select()
      .single();

    if (memorialError || !memorialData) {
      console.error("Error seeding memorial profile:", memorialError);
      return;
    }

    const newMemorialId = memorialData.id;

    // 2. Add associated data
    await supabase.from('conditional_responses').insert(sampleResponsesData.map(r => ({ ...r, memorial_id: newMemorialId })));
    await supabase.from('social_links').insert(sampleSocialLinksData.map(l => ({ ...l, memorial_id: newMemorialId })));
    await supabase.from('tributes').insert(sampleTributesData.map(t => ({ ...t, memorial_id: newMemorialId })));

    console.log("Seeding complete.");
  };
  
  const fetchMemorialData = useCallback(async (id: string) => {
    setLoading(true);
    
    const { data: profile, error: profileError } = await supabase
      .from('memorials')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching memorial profile:', profileError?.message);
      setMemorial(null);
      setLoading(false);
      return;
    }

    const [
        { data: responses },
        { data: socialLinks },
        { data: tributes }
    ] = await Promise.all([
        supabase.from('conditional_responses').select('*').eq('memorial_id', id),
        supabase.from('social_links').select('*').eq('memorial_id', id),
        supabase.from('tributes').select('*').eq('memorial_id', id).order('created_at', { ascending: false })
    ]);
    
    setMemorial({
        profile: profile as CreatorProfile,
        responses: (responses as ConditionalResponse[]) || [],
        socialLinks: (socialLinks as SocialLink[]) || [],
        tributes: (tributes as Tribute[]) || [],
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    if (memorialId) {
        fetchMemorialData(memorialId);
    } else {
        setMemorial(null);
        setLoading(false);
    }
  }, [memorialId, fetchMemorialData]);
  

  const addConditionalResponse = async (newResponse: Omit<ConditionalResponse, 'id' | 'memorial_id'>) => {
    if (!memorial) return;
    const { error } = await supabase.from('conditional_responses').insert({ ...newResponse, memorial_id: memorial.profile.id });
    if (error) console.error("Error adding response:", error);
    else fetchMemorialData(memorial.profile.id);
  };

  const removeConditionalResponse = async (id: string) => {
    if (!memorial) return;
    const { error } = await supabase.from('conditional_responses').delete().eq('id', id);
    if (error) console.error("Error removing response:", error);
    else fetchMemorialData(memorial.profile.id);
  };
  
  const addTribute = async (newTribute: Omit<Tribute, 'id' | 'memorial_id' | 'created_at'>) => {
    if (!memorial) return;
    const { error } = await supabase.from('tributes').insert({ ...newTribute, memorial_id: memorial.profile.id });
    if (error) console.error("Error adding tribute:", error);
    else fetchMemorialData(memorial.profile.id);
  };

  const findResponseForMessage = (message: string): ConditionalResponse | null => {
    if (!memorial) return null;
    const lowerCaseMessage = message.toLowerCase();
    for (const res of memorial.responses) {
        if (lowerCaseMessage.includes(res.keyword.toLowerCase())) {
            return res;
        }
    }
    return null;
  };

  const addSocialLink = async (newLink: Omit<SocialLink, 'id' | 'memorial_id'>) => {
    if (!memorial) return;
    const { error } = await supabase.from('social_links').insert({ ...newLink, memorial_id: memorial.profile.id });
    if (error) console.error("Error adding link:", error);
    else fetchMemorialData(memorial.profile.id);
  };

  const removeSocialLink = async (id: string) => {
    if (!memorial) return;
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    if (error) console.error("Error removing link:", error);
    else fetchMemorialData(memorial.profile.id);
  };

  return (
    <MemorialProfileContext.Provider value={{ memorial, loading, refetch: () => memorialId && fetchMemorialData(memorialId), addConditionalResponse, removeConditionalResponse, addTribute, findResponseForMessage, addSocialLink, removeSocialLink }}>
      {children}
    </MemorialProfileContext.Provider>
  );
};

export const useMemorialProfile = () => {
  const context = useContext(MemorialProfileContext);
  if (context === undefined) {
    throw new Error('useMemorialProfile must be used within a MemorialProfileProvider');
  }
  return context;
};