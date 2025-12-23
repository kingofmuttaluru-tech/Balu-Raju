
import { GoogleGenAI } from "@google/genai";

export const getHealthInsights = async (testName: string, query?: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a medical assistant at Gagan Diagnostic Centre. Provide a brief, patient-friendly explanation for the test: ${testName}. ${query ? `Specifically answer: ${query}` : 'Mention common reasons for this test and basic preparation needed.'} Keep it professional and empathetic. Disclaimer: Always consult a doctor.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return "Unable to load insights at this time. Our AI assistant is currently resting. Please contact our front desk for assistance.";
  }
};
