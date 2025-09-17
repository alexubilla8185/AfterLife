export enum ResponseType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface ConditionalResponse {
  id: string;
  memorial_id: string;
  keyword: string;
  response: string;
}

export interface Tribute {
  id:string;
  memorial_id: string;
  author: string;
  message: string;
  created_at: string;
}

export interface SocialLink {
  id: string;
  memorial_id: string;
  platform: string;
  url: string;
}

export interface CreatorProfile {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  life_span: string;
  profile_image_url: string;
}

export interface MemorialData {
    profile: CreatorProfile;
    responses: ConditionalResponse[];
    socialLinks: SocialLink[];
    tributes: Tribute[];
}


export interface ChatMessage {
    id: string;
    sender: 'user' | 'memorial';
    text: string;
    timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
}