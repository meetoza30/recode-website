import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveFromPinecone, retrieveCore } from "./fetchPinecone.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function extractJSON(text) {
  if (!text) return null;
  try {
    // Extract JSON block
    const match = text.match(/\{[\s\S]*\}/);
    const jsonStr = match ? match[0] : text;
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("JSON parse error:", err.message);
    return null;
  }
}

async function generateRoadmap(company, userQuery) {
  // Step 1: Retrieve data
  const companyRes = await retrieveFromPinecone(`${company} \n ${userQuery}`);
  const coreRes = await retrieveCore(`${userQuery}`);

  const prompt = `
You are a career prep assistant. 
Generate a roadmap in **strict JSON format only**. 
Do not add any explanations outside JSON. 

Context:
[A] Company: "${company}"
[C] User request: "${userQuery}"
[D] Company-specific coding questions (use ALL of them): ${JSON.stringify(companyRes, null, 2)}
[E] Core subject questions (use ALL of them): ${JSON.stringify(coreRes, null, 2)}

Rules:
1. Always output JSON only, no extra text.
2. Roadmap must include ALL the questions from [D] and [E].
3. Organize roadmap as an ordered array of steps.
4. Each step must include a "title" and "questions".
5. If user mentions DSA weak areas in [C], put those DSA topics in Step 1, with the title mentioning those topics or mention easy questions in step 1.
6. Remaining company-specific DSA go into Step 2 with title "more questions to practice for " [A].
7. Core subject ordering: If weak subjects are mentioned, put them earlier; then the rest. Strictly refer [E] for the core questions.
8. Strictly follow schema:

{
  "company": "...",
  "roadmap": [
    {
      "step": <number>,
      "title": "<string>",
      "questions": [{}]
    }
  ]
}

DSA Questions format:
"questions": [
  {
    "id": "",
    "title": "",
    "difficulty": "",
    "link": "",
    "youtube_videos": [""],
    "topics": [""]
  }
]

Core Questions format:
"questions": [
  {
    "id": "",
    "question": "",
    "difficulty": "",
    "answer": ""
  }
]
`;

  const result = await model.generateContent(prompt);
  const llm_text = result.response.text();
  return extractJSON(llm_text);
}

// Example run
// (async () => {
//   const roadmap = await generateRoadmap(
//     "Barclays",
//     "Software Development Intern",
//     "In dsa i am weak in DFS. I am also weak in OS and DBMS"
//   );
//   console.log(JSON.stringify(roadmap, null, 2));
// })();

export default generateRoadmap;
