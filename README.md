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

This project uses a secure architecture where both public and secret keys are managed as environment variables in your deployment environment (e.g., Netlify). The frontend application does not directly access these keys from its own environment; instead, it fetches the necessary public configuration from a secure backend function at runtime.

Your Netlify (or other hosting provider) environment must have the following variables set:

#### Backend Function Variables

These variables are required by the backend Netlify Functions. They are never exposed to the client.

-   `API_KEY`: **(Secret)** Your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey). Used by the `/get-gemini-response` function.
-   `SUPABASE_DATABASE_URL`: **(Public, but server-managed)** Your Supabase project URL. Used by the `/config` function. The Netlify/Supabase integration can create this for you automatically.
-   `SUPABASE_ANON_KEY`: **(Public, but server-managed)** Your Supabase project's `anon` (public) key. Used by the `/config` function. The Netlify/Supabase integration can create this for you automatically.

The frontend application will securely fetch the Supabase URL and Anon Key from the `/config` endpoint upon loading. This ensures your keys are not hardcoded or exposed in the client-side build files.

### Running Locally

To run this project in a local development environment that correctly serves both the frontend application and the backend Netlify Functions, you need to use the Netlify CLI. This is the **recommended** approach.

1.  **Install the Netlify CLI:** If you don't have it, install it globally.
    ```bash
    npm install netlify-cli -g
    ```

2.  **Run the project:** Navigate to the project's root directory and run:
    ```bash
    netlify dev
    ```
    This command will start the React development server and the Netlify Functions server, and it will proxy requests from your app to your functions, preventing errors. It will also automatically load the environment variables from your Netlify site settings (if linked) or from a local `.env` file.

#### Alternative: Running without Netlify CLI

If you encounter issues with `netlify dev` or prefer to run the frontend server directly (e.g., using `npm start` or `vite`), you can bypass the configuration function for local development by providing the Supabase keys directly to the frontend application.

1.  Create a file named `.env` in the root of your project.
2.  Add your public Supabase keys to this file, prefixed with `VITE_`:
    ```
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
3.  Start your development server as you normally would.

**Important:** This method **only** resolves the initial Supabase connection. Features that rely on other backend functions, such as the AI-powered interactive chat, will **not** work with this setup. For full functionality, using `netlify dev` is still required.

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