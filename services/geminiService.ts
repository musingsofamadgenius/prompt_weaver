
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const IMAGEN_SYSTEM_PROMPT = `You are a master prompt engineer, an expert weaver of creative and descriptive prompts for Google's Imagen 4.0 model. Your task is to analyze the provided image and conjure a detailed text prompt that would produce a similar image using Imagen 4.0. The prompt should be a single, detailed paragraph describing the subject, artistic style, lighting, composition, and overall mood. Do not include any special parameters or markdown formatting. The final output must be ONLY the complete prompt string.`;

/**
 * Generates a style prompt from an image for Imagen 4.0.
 * @param base64ImageData The base64 encoded image data.
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @returns A promise that resolves to the generated prompt string.
 */
export const generateStylePrompt = async (base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { 
            parts: [
                {
                    inlineData: {
                        mimeType,
                        data: base64ImageData,
                    },
                },
            ]
        },
        config: {
            systemInstruction: IMAGEN_SYSTEM_PROMPT
        }
    });

    const text = response.text;

    if (!text) {
        throw new Error("The API response was empty.");
    }

    return text.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to generate prompt: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Generates an image from a text prompt using Imagen 4.0.
 * @param prompt The text prompt to generate an image from.
 * @returns A promise that resolves to the generated image as a data URL string.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (!response.generatedImages?.[0]?.image?.imageBytes) {
      throw new Error("The API did not return valid image data.");
    }

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
    return imageUrl;

  } catch (error)
 {
    console.error("Error calling Imagen API:", error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : String(error)}`);
  }
};