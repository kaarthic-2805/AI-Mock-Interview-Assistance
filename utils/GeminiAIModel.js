// utils/GeminiAIModal.js
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Only log in development mode to avoid exposing sensitive info
if (process.env.NODE_ENV === 'development') {
  console.log("Gemini API key status:", apiKey ? "✓ Loaded" : "✗ Missing");
}

// Check if API key exists
if (!apiKey) {
  console.error("NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Export a function to create new chat sessions
export const createChatSession = () => {
  return model.startChat({
    generationConfig,
    safetySettings,
    history: [], // Start with empty history for each new session
  });
};

// Export a default chat session
export const chatSession = model.startChat({
  generationConfig,
  safetySettings,
});

// Named export for consistency
export const ChatSession = chatSession;

// Default export
export default chatSession;