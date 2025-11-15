import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // Here we'll just log an error to the console.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

export function createChatSession(): Chat {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful and friendly assistant integrated into the Aura Browser. Keep your responses concise and informative.',
    },
  });
}

export async function sendMessageToChat(chat: Chat, message: string): Promise<string> {
   try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    // FIX: The `text` property of a `GenerateContentResponse` should be accessed directly, not called as a function.
    return response.text;
  } catch (error) {
    console.error("Error sending message:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}