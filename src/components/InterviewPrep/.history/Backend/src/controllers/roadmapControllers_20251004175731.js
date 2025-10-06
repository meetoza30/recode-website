import { supabase } from "../config/supabase.js";
import generateRoadmap from "../scripts/roadmap3.js";

const generateRoad_map = async(req, res)=>{ 
    try{
        const start = Date.now();
        const {userId} = req.params;
        const { company} = req.body;
        const {data, error}  = await supabase
        .from("users")
        .select("quiz_score")
        .eq("id", userId)
        console.log(data);
        const roadmapStructure = await generatePersonalizedRoadmap(company, data)
         const end = Date.now()
         const responseTime = (end - start) / 1000;
        res.json({ success: true, roadmapStructure, responseTime});
    }
    catch(err){
        console.error("Error generating roadmap:", err);
        res.status(500).json({ success: false, error: err.message });
    }
}

function addProgressCheckbox(roadmap){
  return {
    ...roadmap,
    roadmap: roadmap.roadmap.map(step => ({
      ...step,
      questions: step.questions.map(q => ({
        ...q,
        completed: q.completed ?? false
      }))
    }))
  };
}

const saveRoadmap = async(req, res)=>{
    try{
        const { userId, roadmapName, roadmap } = req.body;
        const company = roadmap.company;

        if (!userId || !company || !roadmapName || !roadmap) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const processedRoadmap = addProgressCheckbox(roadmap);

    const { data, error } = await supabase
      .from("roadmaps")
      .insert([
        {
          user_id: userId,
          company,
          roadmap_name: roadmapName,
          roadmap: processedRoadmap.roadmap
        }
      ])
      .select();

    if (error) throw error;

    res.json({ success: true, roadmap: data[0] });
    }
    catch(err){
        console.error("Error saving roadmap:", err);
        res.status(500).json({ success: false, error: err.message });
    }
}

const getUserRoadmaps = async(req, res)=>{
    try{
        const { id } = req.params;

    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("user_id", id);

    if (error) throw error;

    res.json({ success: true, roadmaps: data });
    }
    catch(err){
        console.error("Error fetching user roadmaps:", err);
    res.status(500).json({ success: false, error: err.message });
    }
}

const getARoadmap = async(req, res)=>{
    try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.json({ success: true, roadmap: data });
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

const updateRoadMap = async(req, res)=>{
    try {
    const { id } = req.params;
    const { roadmap } = req.body; // updated roadmap JSON with checkboxes

    const { data, error } = await supabase
      .from("roadmaps")
      .update({ roadmap })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({ success: true, roadmap: data[0] });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}


export {generateRoad_map, saveRoadmap, getUserRoadmaps, getARoadmap, updateRoadMap}