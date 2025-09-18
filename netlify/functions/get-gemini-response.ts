import { GoogleGenAI } from "@google/genai";
import type { Handler } from "@netlify/functions";

// This is a secure backend function, so we can safely use process.env
// Netlify will populate this from your site's environment variables.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  // This will cause the function to fail with a clear error message
  // if the API_KEY is not set in the Netlify UI.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

const handler: Handler = async (event) => {
  // Handle CORS preflight requests.
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Ensure it's a POST request.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  
  try {
    const { creatorName, userMessage } = JSON.parse(event.body || '{}');

    if (!creatorName || !userMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing creatorName or userMessage in request body' }),
      };
    }

    const systemInstruction = `You are embodying the gentle, loving memory of a person named ${creatorName} who has passed away. A visitor is interacting with their memorial and has just said: "${userMessage}".

Your task is to provide a comforting, abstract, and warm response. Do not impersonate ${creatorName} directly or make specific claims or memories. Speak in a way that evokes their spirit and offers solace. The tone should be peaceful and reassuring. Keep the response to 1-2 sentences.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 1,
        topK: 32,
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
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: "An internal error occurred while generating the response." }),
    };
  }
};

export { handler };
