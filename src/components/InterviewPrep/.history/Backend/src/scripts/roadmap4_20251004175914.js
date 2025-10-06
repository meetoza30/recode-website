import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveFromPinecone, retrieveCore } from "./fetchPinecone.js";
import { supabase } from "../config/supabase.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: {
        maxOutputTokens: 8192,  
        temperature: 0.2, 
    } });

function extractJSON(text) {
    if (!text) return null;
    try {
        const match = text.match(/\{[\s\S]*\}/);
        const jsonStr = match ? match[0] : text;
        return JSON.parse(jsonStr);
    } catch (err) {
        console.error("JSON parse error:", err.message);
        return null;
    }
}


function determineUserLevel(dsaScore) {
    if (dsaScore <= 2) return 'beginner';
    if (dsaScore <= 5) return 'intermediate';
    return 'advanced';
}

function filterDSAProblems(companyQuestions, userLevel, targetCompany, fundamentalDSA) {
    const allProblems = fundamentalDSA;
    const companySpecificProblems = companyQuestions;
    // console.log("user level : ",userLevel)
    const fundamentalTopics = ['Array', 'Hash Table', 'String', 'Two Pointers', 'Math', 'Linked List'];
    const intermediateTopics = ['Binary Search', 'Tree', 'Dynamic Programming', 'Stack', 'Queue'];
    const advancedTopics = ['Graph', 'Backtracking', 'Trie', 'Heap', 'Greedy'];
    
    let roadmapStructure = {};
    
    switch(userLevel) {
        case 'beginner':
            roadmapStructure = {
                fundamentals: allProblems.filter(q => 
                    q.difficulty === 'EASY' && 
                    fundamentalTopics.some(topic => q.topics.includes(topic))
                ).slice(0, 25),
                
                intermediate: allProblems.filter(q => 
                    q.difficulty === 'MEDIUM' && 
                    fundamentalTopics.some(topic => q.topics.includes(topic))
                ).slice(0, 10),
                
                companySpecific: companySpecificProblems.filter(q => 
                    q.difficulty === 'EASY'
                ).slice(0, 10)
            };
            break;
            
        case 'intermediate':
            roadmapStructure = {
                fundamentals: allProblems.filter(q => 
                    q.difficulty === 'EASY'
                ).slice(0, 10),
                
                intermediate: allProblems.filter(q => 
                    q.difficulty === 'MEDIUM' &&
                    [...fundamentalTopics, ...intermediateTopics].some(topic => q.topics.includes(topic))
                ).slice(0, 20),
                
                companySpecific: companySpecificProblems.filter(q => 
                    q.difficulty === 'EASY' || q.difficulty === 'MEDIUM'
                ).slice(0, 25)
            };
            break;
            
        case 'advanced':
            roadmapStructure = {

                intermediate: allProblems.filter(q => 
                    (q.difficulty === 'MEDIUM' || q.difficulty === 'HARD') &&
                    [...intermediateTopics, ...advancedTopics].some(topic => q.topics.includes(topic))
                ).slice(0, 15),
                
                companySpecific: companySpecificProblems.filter(q => 
                    q.frequency >= 40
                ).slice(0, 25)
            };
            break;
    }
    // console.log(roadmapStructure?.beginner.length, roadmapStructure?.intermediate.length, roadmapStructure?.companySpecific.length)
    return roadmapStructure;
}

function filterCoreQuestions(coreQuestions, quizScores) {
    const coreRoadmap = {};
    
    // console.log(coreQuestions)
    const subjects = ['os', 'dbms', 'cn'];
    
    subjects.forEach(subject => {
        const score = quizScores[subject] || 0;
        const maxScore = 4; // 4 questions per subject
        const subjectQuestions = coreQuestions.filter(q => 
            q.subject.toLowerCase() === subject.toLowerCase()
        );
        
        if (score === 0) {
        
            coreRoadmap[subject] = subjectQuestions.filter(q => 
                q.difficulty_rating >= 1 && q.difficulty_rating <= 4
            );
        } else if (score <= 2) {
        
            coreRoadmap[subject] = subjectQuestions.filter(q => 
                q.difficulty_rating >= 1 && q.difficulty_rating <= 5
            );
        } else {
    
            const fundamentals = subjectQuestions.filter(q => 
                q.difficulty_rating >= 1 && q.difficulty_rating <= 3 && (q.difficulty_level === 'Hard' || q.difficulty_level === 'Medium')
            );
            const advanced = subjectQuestions.filter(q => 
                q.difficulty_rating >= 4 && q.difficulty_rating <= 5
            );
            coreRoadmap[subject] = [...fundamentals, ...advanced];
        }
    });
    
    return coreRoadmap;
}

function createCompactQuestionSummary(questions, type = 'dsa') {
    if (type === 'dsa') {
        return questions.map(q => ({
            id: q.id,
            title: q.title,
            difficulty: q.difficulty,
            topics: q.topics,
            frequency: q?.frequency
        }));
    } else {
        return questions.map(q => ({
            id: q.id,
            question: q.question.substring(0, 100) + '...', 
            topic: q.topic,
            difficulty: q.difficulty_level,
            difficulty_rating: q.difficulty_rating
        }));
    }
}

async function enrichRoadmapWithQuestions(roadmapStructure, allQuestions) {
    const { dsaQuestions, coreQuestions } = allQuestions;
    
    const dsaMap = new Map();
    const coreMap = new Map();
    
    dsaQuestions.forEach(q => {
        if (q && q.id) {
            dsaMap.set(q.id, q);
            dsaMap.set(String(q.id), q);
            dsaMap.set(Number(q.id), q);
        }
    });
    
    coreQuestions.forEach(q => {
        if (q && q.id) {
            coreMap.set(q.id, q);
            coreMap.set(String(q.id), q);
            coreMap.set(Number(q.id), q);
        }
    });
    
    const enrichedRoadmap = roadmapStructure.roadmap.map((step, index) => {
       
        if (step.question_ids && Array.isArray(step.question_ids)) {            
            const questions = step.question_ids
                .map(id => {
                    const question = dsaMap.get(id) || dsaMap.get(Number(id)) || dsaMap.get(String(id));
                    if (!question) {
                        console.warn(`id not found`);
                    }
                    return question;
                })
                .filter(q => q !== undefined);
            return {
                ...step,
                question_ids: null,
                questions
            };
        }
        else if (step.core_questions && Array.isArray(step.core_questions)) {
    
            const enrichedTopics = step.core_questions.map((topicGroup, topicIndex) => {
                if (topicGroup.questions && Array.isArray(topicGroup.questions)) {
                    const questions = topicGroup.questions
                        .map(id => {
                            const question = coreMap.get(id) || coreMap.get(Number(id)) || coreMap.get(String(id));
                            if (!question) {
                                console.warn(`id not found in : ${topicGroup.topic}`);
                            }
                            return question;
                        })
                        .filter(q => q !== undefined);
                    
                    return {
                        ...topicGroup,
                        questions
                    };
                }
            
                return topicGroup;
            });
            
            return {
                ...step,
                core_questions: enrichedTopics
            };
        }
        else {
            return step;
        }
    });
    
    return {
        ...roadmapStructure,
        roadmap: enrichedRoadmap
    };
}


async function generatePersonalizedRoadmap(company, quizResults) {

    // quizResults = JSON.stringify(quizResults);
    // console.log("quizresults : ", quizResults)
    const dsaScore = quizResults.dsa || 0;
    const coreScores = {
        os: quizResults.os,
        dbms: quizResults.dbms,
        cn: quizResults.cn
    };
    // console.log("core scores : ", coreScores)
    

    const userLevel = determineUserLevel(dsaScore);
    

    const companyRes = await retrieveFromPinecone(`${company}`);
    var {data, error}  = await supabase
    .from("curated_dsa_questions")
    .select("*")

    // console.log("curated dsa questions : ", data);

    
    const fundamentalDSA = data;

    var { data, error } = await supabase
      .from("core_questions")
      .select("*");
// console.log("curated dsa questions : ", data);
    const coreRes = data;

    
    
 
    const dsaRoadmap = filterDSAProblems(companyRes, userLevel, company, fundamentalDSA) ;
    // console.log("dsa roadmap : ", dsaRoadmap)
    // console.log(dsaRoadmap)
    const coreRoadmap = filterCoreQuestions(coreRes, coreScores);
    // console.log("core roadmap : ", coreRoadmap)

        const dsaCompact = {
        fundamentals: createCompactQuestionSummary(dsaRoadmap.fundamentals || [], 'dsa'),
        intermediate: createCompactQuestionSummary(dsaRoadmap.intermediate || [], 'dsa'),
        companySpecific: createCompactQuestionSummary(dsaRoadmap.companySpecific || [], 'dsa')
    };

    // console.log(dsaCompact);
    
    const coreCompact = {
        os: createCompactQuestionSummary(coreRoadmap.os || [], 'core'),
        dbms: createCompactQuestionSummary(coreRoadmap.dbms || [], 'core'),
        cn: createCompactQuestionSummary(coreRoadmap.cn || [], 'core')
    };

    // console.log("core compact : ", coreCompact)
    
    const prompt = `
You are a personalized career prep assistant.
Generate a roadmap in **strict JSON format only**.
Do not add any explanations outside JSON.

Context:
[A] Company: "${company}"
[B] User Level: "${userLevel}" (based on DSA quiz score: ${dsaScore}/8)
[C] Core Subject Scores: OS=${coreScores.os}/4, DBMS=${coreScores.dbms}/4, CN=${coreScores.cn}/4

Pre-filtered Questions based on user performance:
[Q1] DSA_FUNDAMENTALS: ${JSON.stringify(dsaCompact.fundamentals, null, 2)}
[Q2] DSA_INTERMEDIATE: ${JSON.stringify(dsaCompact.intermediate, null, 2)}
[Q3] DSA_COMPANY_SPECIFIC: ${JSON.stringify(dsaCompact.companySpecific, null, 2)}
[Q4] CORE_QUESTIONS: ${JSON.stringify(coreCompact, null, 2)}

Roadmap Generation Rules:
1. Always output JSON only, no extra text.
2. Create a progressive learning path based on user's ${userLevel} level.
3. For ${userLevel} users:
   ${userLevel === 'beginner' ? 
     '- Start with fundamentals. 70% basics from [Q1] and [Q2], 30% company-specific easy problems from [Q3]' :
     userLevel === 'intermediate' ? 
     '- Balanced approach. Take all easy questions from [Q1] which will be helping the user to build fundamentals for [A]. Cover all the questions from [Q2] and EASY & MEDIUM (and few HARD ones) questions from [Q3]' :
     '- Take only 20% questions from [Q1] which will be helping the user to build fundamentals for [A]. Cover all the questions from [Q2] and [Q3] '
   }

4. DSA Steps:
   - Step 1: "Build Fundamentals in DSA" (use [Q1] & [Q2]);
   - Step 2: "Must pratice question for "${company} (use [Q3])

5. Core Subject Steps (prioritize weak subjects first): 
    - Based on the scores achieved by the user [C].
    - If the score in any core subject is = 0 then cover all the cover EASY and MEDIUM questions from all the topics mentioned in [Q4]
      else if (1 < score <= 4) then cover MEDIUM & HARD questions for topics with difficulty ratings 1,2,3 and for difficulty ratings 4,5 cover all the questions mentioned in [Q4].
6. Step 1 & 2 should be for DSA and further steps should be covering all 3 core subjects. 
7. Sort questions Easy → Medium → Hard within each topic
8. Cover all the core subjects like cn, dbms, os (in steps 3, 4, 5)

Schema:
{
  "company": "...",
  "roadmap": [
    {
      "step": ,
      "title": "",
      "description": "...",
      "estimated_time": "2 weeks",
      "question_ids" : [] //same id as provided to you in [Q1], [Q2],[Q3]. mention ids not question title
    }
  ]
}

Core Questions format:
{
  "step": 3
  "id": "",
  "subject": "",
  "core_questions":[
    {
  "topic": "", // cover questions for a specific topic 
  questions : [
   question_ids //as mentioned in [Q4]
  ]
    }
  ]
}

IMPORTANT:
- Group core questions by their "topic" field
- Include question_ids for EVERY topic
`;

    const result = await model.generateContent(prompt);
    const llm_text = result.response.text();
    const roadmapStructure = extractJSON(llm_text);
    // console.log(llm_text)
const allDSAQuestions = [
        ...(dsaRoadmap.fundamentals || []),
        ...(dsaRoadmap.intermediate || []),
        ...(dsaRoadmap.companySpecific || [])
    ];
    
    const allCoreQuestions = [
        ...(coreRoadmap.os || []),
        ...(coreRoadmap.dbms || []),
        ...(coreRoadmap.cn || [])
    ];
    const enrichedRoadmap = await enrichRoadmapWithQuestions(roadmapStructure, {
        dsaQuestions: allDSAQuestions,
        coreQuestions: allCoreQuestions
    });

    // console.log('roadmap enriched : ');
    // console.log(JSON.stringify(enrichedRoadmap, null, 2));
    
    return enrichedRoadmap;
}


async function generateRoadmap(company, userQuery, quizResults = null) {
    if (quizResults) {
        return generatePersonalizedRoadmap(company, userQuery, quizResults);
    }
    
    // Fallback to original logic if no quiz results
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
5. If user mentions DSA weak areas in [C], put those DSA topics in Step 1.
6. Remaining company-specific DSA go into Step 2 with title "more questions to practice for " [A].
7. Core subject ordering: If weak subjects are mentioned, put them earlier.

Schema:
{
  "company": "...",
  "roadmap": [
    {
      "step": 1,
      "title": "",
      "questions": [{}]
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const llm_text = result.response.text();
    return extractJSON(llm_text);
}

// generatePersonalizedRoadmap("Nvidia", "", {
//   "cn": 2,
//   "os": 1,
//   "dsa": 6,
//   "dbms": 4
// })

export default generatePersonalizedRoadmap;