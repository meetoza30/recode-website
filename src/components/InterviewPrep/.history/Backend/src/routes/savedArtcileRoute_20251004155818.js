import { supabase } from "../config/supabase.js";

const getSavedArticles = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("saved_articles")
      .select(`interview_experiences (*)`) // fetch all columns
      .eq("user_id", userId)
      .order("saved_at", { ascending: false });

      console.log(data);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    
    res.json({ success: true, saved_articles: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



const saveArticle = async (req, res) => {
  try {
    const { userId } = req.params;
    const { article_id } = req.body;     

   
  const { data, error } = await supabase
  .from("saved_articles")
  .insert([{ user_id: userId, article_id }])
  .select(`interview_experiences (*)`);



    if (error) {
      // handle duplicate save
      if (error.code === "23505") {
        return res.status(400).json({ success: false, message: "Article already saved"});
      }
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(201).json({ success: true, saved: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteSavedArticle = async (req, res) => {
  try {
    const { userId} = req.params;
    const {article_id} = req.body;

    const { error } = await supabase
      .from("saved_articles")
      .delete()
      .eq("user_id", userId)
      .eq("article_id", article_id);

    if (error) return res.status(400).json({ success: false, message: error.message });

    res.json({ success: true, message: "Article removed from saved list" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {getSavedArticles,saveArticle,deleteSavedArticle}