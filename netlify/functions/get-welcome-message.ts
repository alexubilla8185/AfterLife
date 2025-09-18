import { GoogleGenAI } from "@google/genai";
import type { Handler } from "@netlify/functions";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  
  try {
    const { name, bio } = JSON.parse(event.body || '{}');

    if (!name || !bio) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing name or bio in request body' }),
      };
    }

    const systemInstruction = `You are the gentle, welcoming spirit of a person named ${name} whose bio is: "${bio}". 
Generate a single, short (1-2 sentences) welcome message for a visitor who has just arrived at their memorial. 
The tone should be warm, inviting, and reflective, not conversational. Do not ask questions. 
Speak in the first person as if you are the spirit of the memorial.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a welcome message.",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 1,
        topK: 40,
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: response.text }),
    };
  } catch (error) {
    console.error("Error in get-welcome-message function:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: "An internal error occurred." }),
    };
  }
};

export { handler };
