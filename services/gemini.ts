import { GoogleGenAI } from "@google/genai";

// NOTE: In a real app, this key comes from process.env.API_KEY
// For this demo, we assume the user has the environment variable set or we handle it gracefully if missing.
// We will simply warn if missing to prevent crash in this frontend-only scaffold.
const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.warn("Gemini API Key not found or invalid.");
}

export const generateLessonPlan = async (topic: string): Promise<string> => {
  if (!ai) return "Error: Gemini API Key missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a structured lesson plan for a Fintech course on the topic: "${topic}". 
      Include 3 learning objectives, a brief lecture outline, and one activity. 
      Format as HTML with <h3> for headers and <ul> for lists. Keep it concise.`
    });
    return response.text || "No content generated.";
  } catch (e) {
    console.error("Gemini Error:", e);
    return "Failed to generate lesson plan. Please try again.";
  }
};

export const generateFeedback = async (studentContent: string, rubric: string): Promise<string> => {
  if (!ai) return "Error: Gemini API Key missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as a teaching assistant. 
      Student Submission: "${studentContent}"
      Assignment Criteria: "${rubric}"
      
      Provide constructive feedback for the student in 2-3 sentences. Be encouraging but point out potential improvements.`,
    });
    return response.text || "No feedback generated.";
  } catch (e) {
    console.error("Gemini Error:", e);
    return "Failed to generate feedback.";
  }
};