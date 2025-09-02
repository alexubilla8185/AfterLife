import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CreatorProfile, ConditionalResponse, Tribute, ResponseType, SocialLink } from '../types';

// New sample profile for Julian Hayes
const sampleProfile: CreatorProfile = {
    name: 'Julian Hayes',
    lifeSpan: '1968 - 2023',
    bio: 'An insatiable traveler, a captivating storyteller, and a devoted teacher. Julian believed the world was a classroom and every person a story waiting to be told. He collected moments, not things.',
    profileImageUrl: 'https://picsum.photos/seed/julian/256/256',
    responses: [
        { id: '1', keyword: 'miss you', response: 'The journey doesn\'t end here. Think of our time together as a beautiful chapter, not the whole story. The adventure continues, just in a different way.', type: ResponseType.TEXT },
        { id: '2', keyword: 'travel', response: 'Ah, the open road! I hope you\'re still exploring. There\'s so much beauty to see. Don\'t ever lose your sense of wonder.', type: ResponseType.TEXT },
        { id: '3', keyword: 'story', response: 'Every story we shared is a landmark on the map of my heart. Tell them often, and keep the pages turning.', type: ResponseType.TEXT },
        { id: '4', keyword: 'sad', response: 'It\'s alright to feel lost sometimes. Every traveler needs a moment to rest. Remember the good trails we walked together, and let that be your guide.', type: ResponseType.TEXT },
        { id: '5', keyword: 'learn', response: 'The best lesson I ever taught was to stay curious. Keep asking questions, keep seeking answers. The world is full of things to discover.', type: ResponseType.TEXT },
        { id: '6', keyword: 'thank you', response: 'For walking this path with me for a while. It meant the world.', type: ResponseType.TEXT },
    ],
    socialLinks: [
        { id: 'link-1', platform: 'Travel Blog', url: 'https://example.com' },
        { id: 'link-2', platform: 'Photography', url: 'https://example.com/photos' },
        { id: 'link-3', platform: 'Goodreads', url: 'https://goodreads.com/example' },
    ]
};

// New sample tributes for Julian Hayes
const sampleTributes: Tribute[] = [
    {
        id: 'tribute-1',
        author: 'His former student, Anya',
        message: 'Mr. Hayes taught me more than just history; he taught me how to see the world. His stories from his travels made every lesson an adventure. I\'ll carry his wisdom with me always.',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
        id: 'tribute-2',
        author: 'Leo, his travel buddy',
        message: 'Julian, my friend, the trails are quieter without you. From the mountains of Peru to the markets of Marrakech, every step was a joy. Cheers to one last sunset. You are missed.',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
    },
    {
        id: 'tribute-3',
        author: 'His sister, Clara',
        message: 'My brother lived a dozen lifetimes in one. He sent postcards from every corner of the earth, each one filled with wonder. I\'ll miss his calls from faraway places. Rest easy, dear brother.',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 10)),
    }
];


interface MemorialProfileContextType {
  profile: CreatorProfile;
  tributes: Tribute[];
  addConditionalResponse: (response: Omit<ConditionalResponse, 'id'>) => void;
  removeConditionalResponse: (id: string) => void;
  addTribute: (tribute: Omit<Tribute, 'id' | 'timestamp'>) => void;
  findResponseForMessage: (message: string) => ConditionalResponse | null;
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  removeSocialLink: (id: string) => void;
}

const MemorialProfileContext = createContext<MemorialProfileContextType | undefined>(undefined);

export const MemorialProfileProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [profile, setProfile] = useState<CreatorProfile>(sampleProfile);
  // Initialize tributes with sample data
  const [tributes, setTributes] = useState<Tribute[]>(sampleTributes);

  const addConditionalResponse = (newResponse: Omit<ConditionalResponse, 'id'>) => {
    setProfile(p => ({
      ...p,
      responses: [...p.responses, { ...newResponse, id: new Date().toISOString() }],
    }));
  };

  const removeConditionalResponse = (id: string) => {
    setProfile(p => ({
      ...p,
      responses: p.responses.filter(r => r.id !== id),
    }));
  };
  
  const addTribute = (newTribute: Omit<Tribute, 'id' | 'timestamp'>) => {
    setTributes(t => [{ ...newTribute, id: new Date().toISOString(), timestamp: new Date() }, ...t]);
  };

  const findResponseForMessage = (message: string): ConditionalResponse | null => {
    const lowerCaseMessage = message.toLowerCase();
    // Find the best match - could be more sophisticated later
    for (const res of profile.responses) {
        if (lowerCaseMessage.includes(res.keyword.toLowerCase())) {
            return res;
        }
    }
    return null;
  };

  const addSocialLink = (newLink: Omit<SocialLink, 'id'>) => {
    setProfile(p => ({
        ...p,
        socialLinks: [...p.socialLinks, { ...newLink, id: new Date().toISOString() }],
    }));
  };

  const removeSocialLink = (id: string) => {
    setProfile(p => ({
        ...p,
        socialLinks: p.socialLinks.filter(l => l.id !== id),
    }));
  };

  return (
    <MemorialProfileContext.Provider value={{ profile, tributes, addConditionalResponse, removeConditionalResponse, addTribute, findResponseForMessage, addSocialLink, removeSocialLink }}>
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