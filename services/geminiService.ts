import { GoogleGenAI } from "@google/genai";

const fallbackResponse = "Thank you for your message. It's deeply felt and appreciated.";

// This provides a "test-in-place" capability by checking for a client-side API key.
// This is intended for specific testing environments that can securely provide this variable.
// In a standard browser/production build, this will be undefined, and the app will
// correctly fall back to using the secure Netlify Function.
const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

let ai: GoogleGenAI | undefined;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
    console.log("Gemini service initialized in direct client-side mode for testing.");
} else {
    console.log("Gemini service initialized in standard Netlify function mode.");
}

export const getGenericResponse = async (creatorName: string, userMessage: string): Promise<string> => {
    // If we have a client-side AI instance from the environment variable, use it directly.
    if (ai) {
        try {
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
            
            return response.text || fallbackResponse;

        } catch (error) {
            console.error("Error calling Gemini API directly from client:", error);
            return fallbackResponse;
        }
    }
    
    // Otherwise, use the secure Netlify function as intended for production.
    const functionUrl = '/.netlify/functions/get-gemini-response';
    try {
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creatorName, userMessage }),
        });

        if (!response.ok) {
            console.error(`Netlify function returned an error: ${response.statusText}`);
            try {
                const errorData = await response.json();
                console.error("Error details:", errorData);
            } catch (e) {
                // Ignore if the response body is not valid JSON.
            }
            return fallbackResponse;
        }

        const data = await response.json();
        return data.text || fallbackResponse;

    } catch (error) {
        console.error("Error calling the gemini Netlify function:", error);
        return fallbackResponse;
    }
};
