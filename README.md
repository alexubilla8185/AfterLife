# AfterLife - A Digital Legacy Platform

AfterLife is an interactive memorial platform allowing users to create a personalized digital legacy. Creators can add memories, share their story, and pre-program responses, allowing loved ones to interact with their profile after they pass away in a meaningful and comforting way.

## Core Features

### Authentication
- **Multiple Sign-In Options:** Secure sign-up and sign-in with Google or traditional email and password.
- **Seamless Onboarding:** Social logins automatically populate the user's profile with their name and profile picture.
- **Facebook Login (Coming Soon):** Integration is built but temporarily disabled pending developer account setup.

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
- **AI:** Google Gemini API (`@google/genai`) via secure Netlify Functions
- **Build Environment:** Netlify

## Getting Started

### Environment Variable Setup

To run this project, you need to set up environment variables. The method depends on whether you're deploying to Netlify or running the app locally.

#### For Production (on Netlify)

Set these variables in your Netlify site's build settings (`Site settings > Build & deploy > Environment`):

-   `API_KEY`: Your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   `SUPABASE_URL`: Your Supabase project URL.
-   `SUPABASE_ANON_KEY`: Your Supabase project's `anon` (public) key.

---

### Running Locally

There are two ways to run the project locally. Using `netlify dev` is the **required** method for full functionality.

#### 1. The Right Way: Full-Stack with `netlify dev` (Recommended)

This command runs your frontend and backend functions together, simulating the Netlify production environment.

1.  **Create an `.env` file** in the root of your project.
2.  **Add your keys to the `.env` file.** The `netlify dev` command will automatically load them. Use the **non-prefixed** names:
    ```
    # .env file for 'netlify dev'
    API_KEY=your_google_gemini_api_key
    SUPABASE_URL=your_supabase_project_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

3.  **Install the Netlify CLI:**
    ```bash
    npm install netlify-cli -g
    ```

4.  **Run the project:**
    ```bash
    netlify dev
    ```
    This will start a server (usually on `localhost:8888`) with all features, including the AI chat, fully functional.

#### 2. Alternative: Frontend-Only Mode (Limited Functionality)

If you must run the frontend server directly (e.g., using `npm run dev`), the app will start, but it will be in **Offline Mode**. Backend features like AI chat will **not** work.

1.  **Create an `.env` file** in the root of your project.
2.  **Add your keys with the `VITE_` prefix.** This is a Vite convention to expose variables to the frontend.
    ```
    # .env file for 'npm run dev' (frontend-only)
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
3.  Run your development server (e.g., `npm run dev`). The app will load but show an "Offline Mode" banner.

**Important:** For the best local development experience that matches production, always use `netlify dev`.

### Supabase Setup

1.  **Enable Authentication Providers:**
    - In your Supabase project dashboard, navigate to **Authentication** > **Providers**.
    - Enable the providers you wish to use: `Email` and `Google`.
    - For social providers (Google), you will need to provide the **Client ID** and **Client Secret** from the Google Cloud Console. (Note: Facebook setup can be skipped for now as the feature is temporarily disabled).

2.  **Create a Storage Bucket:**
    -   In your Supabase project dashboard, go to the **Storage** section.
    -   Click **New bucket**.
    -   Enter the bucket name as `memorials`.
    -   Toggle **Public bucket** to **ON**.
    -   Click **Create bucket**.

This is required for the audio message feature to work correctly.

## How It Works

AfterLife provides two distinct experiences: the **Creator Dashboard** and the **Visitor View**. Onboarding is seamless; when users sign up with a social provider like Google, their profile name and picture are automatically populated, allowing them to get started right away.

- **Creators** act as architects of their digital memorial. They populate their profile with personal details and, most importantly, create "conditional responses." These are custom messages triggered by keywords, allowing them to leave behind personalized wisdom, stories, and comfort.

- **Visitors** can then interact with this memorial. When they send a message in the chat, the system checks for keywords. If a match is found, it delivers the creator's pre-written response. If not, it uses the Google Gemini API (via a secure backend function) to generate a gentle, non-impersonating, and comforting message that reflects the spirit of the memorial, ensuring a thoughtful interaction every time.