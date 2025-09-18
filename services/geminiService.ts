// This service now acts as a client for our own secure Netlify Function.
// It no longer handles the Gemini API key directly.

const fallbackResponse = "Thank you for your message. It's deeply felt and appreciated.";

export const getGenericResponse = async (creatorName: string, userMessage: string): Promise<string> => {
    // The path to our secure Netlify function.
    // This path is relative to the root of the site and will be handled by Netlify's routing.
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
