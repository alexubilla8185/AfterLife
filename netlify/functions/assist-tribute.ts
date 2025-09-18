import { GoogleGenAI } from "@google/genai";
import type { Handler } from "@netlify/functions";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

const handler: Handler = async (event) => {
  // Handle CORS preflight requests.
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

  // Ensure it's a POST request.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  
  try {
    const { memorialName, memorialBio, userDraft } = JSON.parse(event.body || '{}');

    if (!memorialName || !memorialBio) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing memorialName or memorialBio in request body' }),
      };
    }

    const draftText = userDraft ? `They have started writing: "${userDraft}".` : '';

    const systemInstruction = `You are a thoughtful and empathetic writing assistant. A user is writing a tribute for a person named ${memorialName}, whose bio is: "${memorialBio}". ${draftText} 
    Your task is to generate a heartfelt, respectful, and personal-sounding tribute message. 
    The message should be about 2-4 sentences long. 
    Do not use quotation marks in the response. 
    The tone should be warm and commemorative.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Please generate a tribute message.",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
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
    console.error("Error in assist-tribute function:", error);
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