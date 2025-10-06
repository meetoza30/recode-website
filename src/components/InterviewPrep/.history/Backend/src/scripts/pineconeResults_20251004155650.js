//This file is the “roadmap generation layer” of your application. It combines data retrieval 
// from Pinecone with the LLM (Gemini) to produce a personalized roadmap for a user.

import { GoogleGenerativeAI } from "@google/generative-ai";
import {retrieveFromPinecone, retrieveCore} from "./fetchPinecone.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function extractJSON(text) {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/); // greedy match between first { and last }
  return match ? match[0] : text;
}

const testing = async(userQuery, company)=>{
  const companyRes = await retrieveFromPinecone(`${company} \n ${userQuery}`);
  console.log(companyRes);

  let cnq = 0, dbq = 0, osq = 0;
  for(const obj of companyRes){
    if(obj.subject == 'OS') osq++;
    else if(obj.subject == 'CN') cnq++;
    else if(obj.subject == 'DBMS') dbq++;
  }

  console.log(cnq, dbq, osq);
}


async function generateRoadmap(company, role, userQuery) {
  // Step 1: Fetch context from Pinecone
  const companyRes = await retrieveFromPinecone(`${company} \n ${userQuery}`);
  const coreRes = await retrieveCore(`${userQuery}`);

//   console.log("leetcode questions : ", companyRes);
//   console.log("core questions : ", coreRes);

  const context = [...companyRes, ...coreRes];

const prompt = `
You are a career prep assistant. 
Your task is to generate a roadmap in **strict JSON format only**.
Do not add any explanations outside JSON. 

Context:
[A] User is preparing for company: "${company}"
[B] Target role: "${role}"
[C] User request: "${userQuery}"
[D] Company-specific coding questions: ${JSON.stringify(companyRes, null, 2)}
[E] Core subject questions: ${JSON.stringify(coreRes, null, 2)}

Rules:
1. Always output JSON only, no extra text.
2. Roadmap must be an array of ordered steps.
3. Each step must include a "title" and "questions".
4. Use retrieved data wherever possible.
5. If user mentions any weak areas in the [C] "User request" then take those dsa topics in step 1, in step 2 take other DSA questions than user's weaknesses mentioned in [C] "User request" from the ${company} db and in step 3+ mention all the core subject questions. 
6. If there are any core subjects (CN, DBMS, OS) weakness mentioned by user in [C] "User request" then give pirority to that subject in the order of the roadmap and give other core subjects questions after that. (Mention all the core subjects questions from the [E] "Core subject questions")

7. Strictly follow schema:

JSON Schema:

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

- Step 1 DSA format:
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

- Step 2+ Core subjects format:
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
  const llm_text = extractJSON(result.response.text());
  //   let resJSON;
  // try{
  //   resJSON = JSON.parse(llm_text);
  // }
  // catch(err){
  //   console.log(err);
  // }
  return llm_text;
}

// (async()=>{
//  await testing("i am weak in dfs",  "Barclays");
// })();

// console.log("json text : ", await generateRoadmap("Barclays", "Software Development Intern", ""));