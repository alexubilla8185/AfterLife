export enum ResponseType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface ConditionalResponse {
  id: string;
  keyword: string;
  response: string;
  type: ResponseType;
}

export interface Tribute {
  id: string;
  author: string;
  message: string;
  timestamp: Date;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface CreatorProfile {
  name: string;
  bio: string;
  lifeSpan: string;
  profileImageUrl: string;
  responses: ConditionalResponse[];
  socialLinks: SocialLink[];
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'memorial';
    text: string;
    timestamp: Date;
}