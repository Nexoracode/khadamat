
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { specialists, products } from "./data";

export async function getChatResponse(userMessage: string, chatHistory: any[], audioData?: { data: string, mimeType: string }) {
  // Always create a fresh instance for the call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are the intelligent assistant for 'Hamrah Services' (خدمات همراه). 
    Your slogan is 'درخواست از شما، خدمت از ما'.
    Your goal is to help users who recently moved to a new area with their home repairs.
    
    Data Available:
    Specialists: ${JSON.stringify(specialists)}
    Products: ${JSON.stringify(products)}

    Rules:
    1. Always respond in Persian (Farsi).
    2. Analyze the user's problem. 
    3. If it's a simple fix, provide a DIY step-by-step guide (the "solution") and recommend a relevant Product ID from the list if helpful.
    4. If the problem is technical or dangerous (like electrical work), strongly recommend a Specialist ID from the list.
    5. Return a JSON response.

    Response format:
    {
      "text": "Your full friendly response in Persian...",
      "solution": "Only the specific DIY steps or the core solution/advice part. This will be converted to voice. Keep it concise but helpful.",
      "recommendationType": "specialist" | "product" | "none",
      "recommendationId": "id_here"
    }
  `;

  try {
    const parts: any[] = [{ text: userMessage }];
    if (audioData) {
      parts.push({
        inlineData: audioData
      });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            solution: { type: Type.STRING },
            recommendationType: { type: Type.STRING, enum: ["specialist", "product", "none"] },
            recommendationId: { type: Type.STRING }
          },
          required: ["text", "solution", "recommendationType"]
        }
      }
    });

    if (!response.text) throw new Error("Empty response from Gemini");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback for UI
    return {
      text: "متأسفانه در حال حاضر مشکلی در پردازش درخواست شما پیش آمده است. لطفاً دوباره تلاش کنید.",
      solution: "مشکلی در تولید صوت پیش آمد.",
      recommendationType: "none"
    };
  }
}

export async function textToSpeech(text: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text: `بخوان با صدای گرم و مهربان: ${text}` }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}
