# AfterLife - A Digital Legacy Platform

AfterLife is an interactive memorial platform allowing users to create a personalized digital legacy. Creators can add memories, share their story, and pre-program responses, allowing loved ones to interact with their profile after they pass away in a meaningful and comforting way.

## Core Features

### For Creators
- **Build a Profile:** Craft a personal memorial with a name, lifespan, biography, and profile image.
- **Add Social Links:** Link to personal blogs, photo galleries, or other websites to share more of your story.
- **Record an Audio Message:** Record or upload a personal audio message for visitors to hear your voice.
- **Program Interactive Responses:** Create keyword-based responses. When a visitor's message contains a specific word (e.g., "travel"), the system will reply with a pre-written, personal message from you.
- **Manage Your Legacy:** Easily add or remove links and responses through a simple and intuitive dashboard.

### For Visitors
- **Listen to a Personal Message:** Hear the creator's voice through a recorded audio message on their profile.
- **Interactive Chat:** Engage with the memorial by sending messages. Receive either a creator-programmed response or a gentle, AI-generated reflection.
- **Tribute Wall:** Leave a public tribute or memory for others to see, creating a shared space for remembrance.
- **Explore a Legacy:** View the person's biography and connect with their life through the links they shared.

### Customization
- **Light & Dark Mode:** Choose a theme that's easy on your eyes.

## Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **Database, Auth & Storage:** Supabase
- **AI:** Google Gemini API (`@google/genai`)

## Getting Started

### Prerequisites
- A modern web browser
- A Google account for authentication

### Environment Variable Setup

To run this project, you need to set up environment variables for both Supabase and the Google Gemini API. Your deployment environment (e.g., Netlify) must be configured with the following variables:

1.  **Google Gemini API Key:**
    -   `VITE_API_KEY`: Your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

2.  **Supabase Credentials:**
    -   `VITE_SUPABASE_DATABASE_URL`: Your Supabase project URL. (Note: The Netlify integration may create this variable for you).
    -   `VITE_SUPABASE_ANON_KEY`: Your Supabase project's `anon` (public) key.

These variables are accessed via `process.env` in the application code. The build environment (like Netlify/Vite) is responsible for replacing these with the actual values during the build process, making them available securely in the client-side application.

### Supabase Setup

In addition to authentication and database, this project uses Supabase Storage to handle audio file uploads.

1.  **Create a Storage Bucket:**
    -   In your Supabase project dashboard, go to the **Storage** section.
    -   Click **New bucket**.
    -   Enter the bucket name as `memorials`.
    -   Toggle **Public bucket** to **ON**.
    -   Click **Create bucket**.

This is required for the audio message feature to work correctly.

## How It Works

AfterLife provides two distinct experiences: the **Creator Dashboard** and the **Visitor View**.

- **Creators** act as architects of their digital memorial. They populate their profile with personal details and, most importantly, create "conditional responses." These are custom messages triggered by keywords, allowing them to leave behind personalized wisdom, stories, and comfort.

- **Visitors** can then interact with this memorial. When they send a message in the chat, the system checks for keywords. If a match is found, it delivers the creator's pre-written response. If not, it uses the Google Gemini API to generate a gentle, non-impersonating, and comforting message that reflects the spirit of the memorial, ensuring a thoughtful interaction every time.