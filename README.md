# AfterLife - A Digital Legacy Platform

AfterLife is an interactive memorial platform allowing users to create a personalized digital legacy. Creators can add memories, share their story, and pre-program responses, allowing loved ones to interact with their profile after they pass away in a meaningful and comforting way.

## Core Features

### For Creators
- **Build a Profile:** Craft a personal memorial with a name, lifespan, biography, and profile image.
- **Add Social Links:** Link to personal blogs, photo galleries, or other websites to share more of your story.
- **Program Interactive Responses:** Create keyword-based responses. When a visitor's message contains a specific word (e.g., "travel"), the system will reply with a pre-written, personal message from you.
- **Manage Your Legacy:** Easily add or remove links and responses through a simple and intuitive dashboard.

### For Visitors
- **Interactive Chat:** Engage with the memorial by sending messages. Receive either a creator-programmed response or a gentle, AI-generated reflection.
- **Tribute Wall:** Leave a public tribute or memory for others to see, creating a shared space for remembrance.
- **Explore a Legacy:** View the person's biography and connect with their life through the links they shared.

### Customization
- **Light & Dark Mode:** Choose a theme that's easy on your eyes.
- **Accent Colors:** Personalize the user interface with a custom accent color to match your mood or preference.

## Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API (`@google/genai`)

## Getting Started

### Prerequisites
- Node.js and npm (or a compatible package manager)
- A modern web browser

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd afterlife-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your API Key:**
   This project uses the Google Gemini API for its AI-powered chat features. You will need to obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

   The application is configured to read the `process.env.API_KEY` environment variable. Ensure this is set in your deployment environment.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the local URL provided.

## How It Works

AfterLife provides two distinct experiences: the **Creator Dashboard** and the **Visitor View**.

- **Creators** act as architects of their digital memorial. They populate their profile with personal details and, most importantly, create "conditional responses." These are custom messages triggered by keywords, allowing them to leave behind personalized wisdom, stories, and comfort.

- **Visitors** can then interact with this memorial. When they send a message in the chat, the system checks for keywords. If a match is found, it delivers the creator's pre-written response. If not, it uses the Google Gemini API to generate a gentle, non-impersonating, and comforting message that reflects the spirit of the memorial, ensuring a thoughtful interaction every time.
