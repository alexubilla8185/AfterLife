import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const apiKey = process.env.VITE_API_KEY;

if (apiKey) {
    try {
        ai = new GoogleGenAI({ apiKey: apiKey });
    } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
    }
} else {
    console.warn("VITE_API_KEY environment variable not set. AI features will be disabled and will use fallback responses.");
}


export const getGenericResponse = async (creatorName: string, userMessage: string): Promise<string> => {
    if (!ai) {
        return "I hear you. Your words are a comfort. Thank you for sharing this moment with me.";
    }

    try {
        const systemInstruction = `You are embodying the gentle, loving memory of a person named ${creatorName} who has passed away. A visitor is interacting with their memorial and has just said: "${userMessage}".

Your task is to provide a comforting, abstract, and warm response. Do not impersonate ${creatorName} directly or make specific claims or memories. Speak in a way that evokes their spirit and offers solace. The tone should be peaceful and reassuring. Keep the response to 1-2 sentences.`;
        
        const response = await ai.models.generateContent({
            // FIX: Per @google/genai guidelines, using 'gemini-2.5-flash' instead of the prohibited 'gemini-1.5-flash'.
            model: "gemini-2.5-flash",
            contents: userMessage, // The user message is context, but the system instruction drives the response style
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topP: 1,
                topK: 32,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error generating generic response:", error);
        return "Thank you for your message. It's deeply felt and appreciated.";
    }
};