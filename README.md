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

To run this project, you need to set up environment variables.

#### For Production (on Netlify)

Set these variables in your Netlify site's build settings (`Site settings > Build & deploy > Environment`). **Note the names do not have a `VITE_` prefix.**

-   `API_KEY`: Your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   `SUPABASE_URL`: Your Supabase project URL.
-   `SUPABASE_ANON_KEY`: Your Supabase project's `anon` (public) key.

---

### Running Locally (The Only Supported Way)

For the application to work correctly with all features (including AI chat), you **must** run it using the Netlify CLI. This runs your frontend and backend functions together, perfectly simulating the live production environment.

**Step 1: Create an `.env` file**

Create a file named `.env` in the root of your project. This file is for local development only and should not be committed to Git.

**Step 2: Add Your Keys**

Copy and paste the following into your `.env` file, replacing the placeholder text with your actual keys. Note that these variables also do **not** have the `VITE_` prefix.

```
# .env file for use with 'netlify dev'
API_KEY=your_google_gemini_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Step 3: Install and Run with Netlify CLI**

1.  **Install the Netlify CLI** globally on your machine:
    ```bash
    npm install netlify-cli -g
    ```

2.  **Run the project:**
    ```bash
    netlify dev
    ```

Your browser should open to `localhost:8888` (or a similar port), and all features, including the AI chat, will be fully functional.

### Troubleshooting: Understanding "Offline Mode"

If you see an "Offline Mode" banner at the top of the application, it means the frontend couldn't connect to the backend Netlify functions. This typically happens for one of two reasons:

1.  **You are not using `netlify dev`:** If you run the app with a command like `npm run dev` or `vite`, the backend functions will not be served. The frontend will load, but it won't be able to fetch its configuration or call the Gemini AI function.
2.  **Your environment variables are missing:** The `netlify dev` command relies on the `.env` file being correctly set up with `API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`.

**Fixing Offline Mode:** The only fix is to stop your current server and run `netlify dev` as described in the section above.

### Supabase Setup

1.  **Enable Authentication Providers:**
    - In your Supabase project dashboard, navigate to **Authentication** > **Providers**.
    - Enable the providers you wish to use: `Email` and `Google`.
    - For social providers (Google), you will need to provide the **Client ID** and **Client Secret** from the Google Cloud Console.

2.  **Create a Storage Bucket:**
    -   In your Supabase project dashboard, go to the **Storage** section.
    -   Click **New bucket**.
    -   Enter the bucket name as `memorials`.
    -   Toggle **Public bucket** to **ON**.
    -   Click **Create bucket**.

This is required for the audio message feature to work correctly.

## How It Works

AfterLife provides two distinct experiences: the **Creator Dashboard** and the **Visitor View**. Onboarding is seamless; when users sign up with a social provider like Google, their profile name and picture are automatically populated.

- **Creators** act as architects of their digital memorial. They populate their profile with personal details and, most importantly, create "conditional responses." These are custom messages triggered by keywords, allowing them to leave behind personalized wisdom, stories, and comfort.

- **Visitors** can then interact with this memorial. When they send a message in the chat, the system checks for keywords. If a match is found, it delivers the creator's pre-written response. If not, it uses the Google Gemini API (via a secure backend function) to generate a gentle, non-impersonating, and comforting message that reflects the spirit of the memorial, ensuring a thoughtful interaction every time.