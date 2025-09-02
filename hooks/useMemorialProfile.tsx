import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CreatorProfile, ConditionalResponse, Tribute, ResponseType, SocialLink } from '../types';

// Expanded sample profile with more responses and social links
const sampleProfile: CreatorProfile = {
    name: 'Eleanor Vance',
    lifeSpan: '1945 - 2024',
    bio: 'A loving mother, a passionate artist, and a friend to all. Eleanor found joy in the simple moments: a sunrise, a shared laugh, a good book. Her canvas was the world, and her masterpiece was a life well-lived.',
    profileImageUrl: 'https://picsum.photos/seed/eleanor/256/256',
    responses: [
        { id: '1', keyword: 'miss you', response: 'I know it feels that way, but love like ours doesn\'t just disappear. It\'s in the stories we shared and the warmth you feel from the sun. I\'m with you.', type: ResponseType.TEXT },
        { id: '2', keyword: 'remember', response: 'Oh, the memories we made! Each one is a little treasure. Hold onto them, and smile when you think of them.', type: ResponseType.TEXT },
        { id: '3', keyword: 'laugh', response: 'I can almost hear it! That sound was my favorite music. Never stop laughing.', type: ResponseType.TEXT },
        { id: '4', keyword: 'sad', response: 'It\'s okay to feel that way. Grief is just love with nowhere to go. Be gentle with yourself and let the memories be a comfort.', type: ResponseType.TEXT },
        { id: '5', keyword: 'art', response: 'My art was my voice. I\'m so glad it still speaks to you. Every brushstroke holds a piece of my heart.', type: ResponseType.TEXT },
        { id: '6', keyword: 'thank you', response: 'You\'re welcome, my dear. Thank you for being here, for remembering.', type: ResponseType.TEXT },
    ],
    socialLinks: [
        { id: 'link-1', platform: 'Personal Blog', url: 'https://example.com' },
        { id: 'link-2', platform: 'LinkedIn', url: 'https://linkedin.com/in/example' },
        { id: 'link-3', platform: 'Art Gallery', url: 'https://example.com/gallery' },
    ]
};

// Sample tributes to pre-populate the wall
const sampleTributes: Tribute[] = [
    {
        id: 'tribute-1',
        author: 'Her loving son, Michael',
        message: 'Mom, not a day goes by that I don\'t think of your smile. You taught me everything about kindness. I see you in every sunset. I love you.',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
        id: 'tribute-2',
        author: 'Sarah, a dear friend',
        message: 'Eleanor, I miss our coffee dates and your infectious laughter. The world is a little less bright without you in it. Thank you for decades of friendship.',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
    },
    {
        id: 'tribute-3',
        author: 'James (neighbor)',
        message: 'Mrs. Vance was the kindest soul. She always had a wave and a smile for everyone. Her garden was as beautiful as she was. Rest in peace.',
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