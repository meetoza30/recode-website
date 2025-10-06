import fs from 'fs';
import Papa from 'papaparse';
import fetch from 'node-fetch';

function titleToSlug(title) {
  return title.trim()
    .toLowerCase()
    .replace(/[^\w ]/g, '')    // Remove punctuation except spaces
    .replace(/\s+/g, '-');     // Replace spaces with hyphens
}

async function getDifficulty(titleSlug) {
  const url = 'https://leetcode.com/graphql';
  const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) { difficulty }
    }`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables:{titleSlug}})
  });
  const data = await res.json();
  return data?.data?.question?.difficulty || 'UNKNOWN';
}

(async () => {
  const csv = fs.readFileSync('dsa_curated_questions_mahesh_with_yt.csv', 'utf8');
  let {data} = Papa.parse(csv, {header:true});
  for (let row of data) {
    const slug = titleToSlug(row.title);
    row.difficulty = await getDifficulty(slug);
    console.log(row.title, '-->', row.difficulty);
    // Optional: add delay here between requests if needed
  }
  // Insert 'difficulty' after 'link', if you want custom ordering:
  const colOrder = Object.keys(data[0]);
  if (colOrder.indexOf('difficulty') >= 0) {
    colOrder.splice(colOrder.indexOf('difficulty'), 1);
    colOrder.splice(colOrder.indexOf('link') + 1, 0, 'difficulty');
  }
  const out = Papa.unparse(data, {columns: colOrder});
  fs.writeFileSync('output_with_difficulty.csv', out);
})();