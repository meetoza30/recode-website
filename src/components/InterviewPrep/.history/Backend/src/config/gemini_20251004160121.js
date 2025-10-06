import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

console.log(process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });