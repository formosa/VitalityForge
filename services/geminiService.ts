import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODELS } from "../constants";

// Define local interface to match expected AI Studio global
interface AIStudioClient {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

// Helper to get global window with aistudio type safety
const getWin = () => window as unknown as (Window & { aistudio?: AIStudioClient });

export const checkApiKey = async (): Promise<boolean> => {
  const win = getWin();
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  // Fallback/Dev mode logic (e.g. if running locally with .env)
  return !!process.env.API_KEY; 
};

export const requestApiKey = async (): Promise<void> => {
   const win = getWin();
   if (win.aistudio && win.aistudio.openSelectKey) {
     await win.aistudio.openSelectKey();
   }
};

const handleApiError = async (error: any) => {
  const errorMessage = error?.message || String(error);
  if (errorMessage.includes("Requested entity was not found.") || errorMessage.includes("404")) {
    console.warn("API Key issue detected (404/Entity Not Found). Prompting for key selection...");
    await requestApiKey();
    throw new Error("The selected API key cannot access the requested model. Please select a project with billing enabled in the popup.");
  }
  throw error;
};

// Generic helper for image generation to reduce duplication
const generateContentImage = async (
  prompt: string,
  modelName: string,
  referenceImageBase64?: string
): Promise<string> => {
  // Always instantiate fresh to pick up potential dynamic key injection from AI Studio environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [];

  if (referenceImageBase64) {
    // Determine mime type from base64 header or default to png
    const mimeType = referenceImageBase64.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
    const data = referenceImageBase64.split(',')[1];
    parts.push({
      inlineData: {
        mimeType,
        data,
      }
    });
  }
  
  // Add text prompt
  parts.push({ text: prompt });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
    });

    // Check for inlineData (image) in parts
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    // Fallback: Check if there's text rejection or safety block
    if (response.promptFeedback?.blockReason) {
        throw new Error(`Generation blocked: ${response.promptFeedback.blockReason}`);
    }

    throw new Error("No image generated from model response. The model may have returned text instead.");
  } catch (error) {
    return handleApiError(error);
  }
};

export const generateCharacterImage = async (
  prompt: string, 
  referenceImageBase64?: string,
  modelName: string = MODELS.IMAGE_DEFAULT
): Promise<string> => {
  return generateContentImage(prompt, modelName, referenceImageBase64);
};

export const generateSpriteSheet = async (
  prompt: string,
  referenceImageBase64: string,
  modelName: string = MODELS.IMAGE_DEFAULT
): Promise<string> => {
  return generateContentImage(prompt, modelName, referenceImageBase64);
};

export const generateAnimationVideo = async (
  prompt: string,
  spriteSheetBase64: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = MODELS.VIDEO_VEO;

  const mimeType = spriteSheetBase64.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
  const data = spriteSheetBase64.split(',')[1];

  try {
    let operation = await ai.models.generateVideos({
      model,
      prompt: prompt,
      image: {
        imageBytes: data,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '1:1'
      }
    });

    // Polling with exponential backoff cap
    let pollCount = 0;
    while (!operation.done) {
      pollCount++;
      // Wait 5s, 5s, 10s, 10s...
      const delay = pollCount > 2 ? 10000 : 5000; 
      await new Promise(resolve => setTimeout(resolve, delay));
      
      operation = await ai.operations.getVideosOperation({ operation: operation });
      
      // Timeout safeguard (approx 3 min)
      if (pollCount > 20) throw new Error("Video generation timed out.");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation completed but returned no URI.");

    return downloadLink;
  } catch (error) {
    return handleApiError(error);
  }
};
