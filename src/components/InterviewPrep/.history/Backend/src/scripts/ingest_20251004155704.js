//This file is your ingestion script for populating Pinecone with embeddings. 
// Its purpose is to fetch data from Supabase, convert it into embeddings, 
// and store those embeddings in Pinecone,

import "dotenv/config";
import {supabase} from "../config/supabase.js"; 
import getLocalEmbedding from "./testEmbedding.js";
import { index } from "../config/pinecone.js";
import { pipeline } from "@xenova/transformers";

async function testing(){
   const { data, error } = await supabase
    .from("company_questions")
    .select("id, title, link, youtube_videos, difficulty, frequency, topics, companies(id, name)");
    
    console.log(data);
    if(error) console.error(error);
}

async function run() {
  // 1. Fetch rows from Supabase (example: leetcode_questions)
  const { data, error } = await supabase
    .from("company_questions")
    .select("id, title, link, youtube_videos, difficulty, frequency, topics, companies(id, name)");

    // console.log(data);
  if (error) {
    console.error("❌ Supabase fetch error:", error);
    return;
  }


  console.log(`Fetched ${data.length} rows from Supabase`);

  // 2. Convert rows → embeddings → Pinecone vectors
  const vectors = [];
  for (const row of data) {
    const inputText = `${row.companies.name}\n${row.title}\n${row.topics}`;
    const embedding = await getLocalEmbedding(inputText);

    console.log("company name : ",row.companies.name)
    vectors.push({
      id: row.id.toString(), // must be unique, uuid is perfect
      values: embedding,
      metadata: {
        company: row.companies.name,
        title: row.title,
        link: row.link,
        youtube_videos: row.youtube_videos,
        difficulty: row.difficulty, 
        frequency: row.frequency, 
        topics: row.topics
      },
    });
  }

  await index.upsert(vectors);
  console.log(`Upserted ${vectors.length} vectors into Pinecone`);
}

const run_core = async()=>{
    const {data, error} = await supabase
    .from("core_questions")
    .select("id, subject, question, answer")

    if(error){
        console.log(error);
    }

    const vectors = [];
    for(const row of data){
        const text = `${row.subject}\n${row.question}`;
        const embedding = await getLocalEmbedding(text);

        vectors.push({
            id: `core-${row.id}`,
            values: embedding,
            metadata:{
                type: "core_question",
                subject: row.subject,
                question: row.question,
                answer: row.answer
            }
        })
    }
    await index.upsert(vectors);
    console.log("vectors upserted!", vectors.length);
}


// testing().catch((err)=>console.error(err));
run().catch((err) => console.error("Ingestion failed:", err));
// run_core().catch((err) => console.error(err));