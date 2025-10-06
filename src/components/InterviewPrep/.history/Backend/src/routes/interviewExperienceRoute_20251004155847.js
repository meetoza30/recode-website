import { supabase } from "../config/supabase.js";
import pkg from "natural";
const { Tokenizer, TfIdf, stopwords } = pkg;

const addInterviewExperience = async (req, res) => {
  try {
    const {
      title, author_id, company_id, role, process_start_date,
      process_end_date, type, application_process, rounds,
      preparation_tips, is_selected, tags
    } = req.body;
    const { data, error } = await supabase
      .from("interview_experiences")
      .insert([{
        title, author_id, company_id, role, process_start_date, process_end_date, type,
        application_process, rounds, // JSONB
        preparation_tips, is_selected, tags
      }])
      .select()
      .single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllInterviewExperiences = async (req, res) => {
  try {
    // CHANGED: Read userId from query parameters instead of request body
    const userId = req.query.id;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("company_interest, role_interest, skills")
      .eq("id", userId)
      .single();
    
    if (userError) {
      return res.status(400).json({ success: false, message: userError.message });
    }
    
    const userQuery = [
      ...(userData.company_interest || []),
      userData.role_interest || "",
      ...(userData.skills || []),
    ].join(" ");
    
    const { data: experiences, error } = await supabase
      .from("interview_experiences")
      .select("*, companies(name), users(name)");
    
    if (error) return res.status(400).json({ success: false, message: error.message });
    
    const tfidf = new TfIdf();
    experiences.forEach((exp, i) => {
      const text = `${exp.title} ${exp.role} ${exp.application_process || ""} ${exp.preparation_tips || ""} ${(exp.tags || []).join(" ")} ${(exp.companies?.name || "")}`;
      tfidf.addDocument(text, i.toString());
    });
    
    const scores = [];
    tfidf.tfidfs(userQuery, function (i, measure) {
      scores.push({ index: i, score: measure });
    });
    
    const ranked = scores
      .map((s) => ({ ...experiences[s.index], similarity: s.score }))
      .sort((a, b) => b.similarity - a.similarity);
    
    res.json({ success: true, data: ranked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

const getRecommendedExperiencesKNN = async (req, res) => {
  try {
    // CHANGED: Read userId from query parameters instead of request body
    const userId = req.query.id;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // 1. Fetch user interests
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("company_interest, role_interest")
      .eq("id", userId)
      .single();
    
    if (userError || !userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const { company_interest, role_interest } = userData;
    const userText = `${(company_interest || []).join(" ")} ${role_interest || ""}`;
    
    // 2. Fetch all experiences
    const { data: experiences, error } = await supabase
      .from("interview_experiences")
      .select("*, companies(name), users(name)");
    
    if (error) return res.status(400).json({ success: false, message: error.message });
    
    // 3. Build TF-IDF
    const tfidf = new TfIdf();
    experiences.forEach(exp => {
      tfidf.addDocument(`${exp.title} ${(exp.tags || []).join(" ")} ${exp.role}`);
    });
    tfidf.addDocument(userText); // add user as "last document"
    
    // 4. Get vectors
    const vocab = tfidf.documents[0] ? Object.keys(tfidf.documents[0]) : [];
    const toVector = (docIndex) => vocab.map(term => tfidf.tfidf(term, docIndex));
    const userVec = toVector(experiences.length); // last doc = user
    const expVectors = experiences.map((_, i) => toVector(i));
    
    // 5. Compute similarity
    const scored = experiences.map((exp, i) => ({
      ...exp,
      score: cosineSimilarity(userVec, expVectors[i]),
    }));
    
    // 6. Sort & return Top-K
    scored.sort((a, b) => b.score - a.score);
    const topK = scored.slice(0, 10000);
    
    res.json({ success: true, data: topK });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getInterviewExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("interview_experiences")
      .select("*, companies(name), users(name)")
      .eq("id", id)
      .single();
    if (error) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getCompanyInterviewExperiences = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { data, error } = await supabase
      .from("interview_experiences")
      .select("*,companies(name)")
      .eq("company_id", companyId);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateInterviewExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updated_at: new Date() };
    const { data, error } = await supabase
      .from("interview_experiences")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteInterviewExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("interview_experiences")
      .delete()
      .eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const addView = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: current, error: fetchError } = await supabase
      .from("interview_experiences")
      .select("views")
      .eq("id", id)
      .single();
    if (fetchError) return res.status(400).json({ success: false, message: fetchError.message });
    const { data, error } = await supabase
      .from("interview_experiences")
      .update({ views: (current.views || 0) + 1 })
      .eq("id", id)
      .select();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getMyInterviewExperiences = async (req, res) => {
  try {
    // User ID from query parameters or authenticated user
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const { data, error } = await supabase
      .from("interview_experiences")
      .select("*, companies(name)")
      .eq("author_id", userId)
      .order("created_at", { ascending: false }); // newest first

    if (error) return res.status(400).json({ success: false, message: error.message });

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export {
  addInterviewExperience,
  getAllInterviewExperiences,
  getInterviewExperience,
  getCompanyInterviewExperiences,
  updateInterviewExperience,
  deleteInterviewExperience,
  addView,
  getRecommendedExperiencesKNN,
  getMyInterviewExperiences
};