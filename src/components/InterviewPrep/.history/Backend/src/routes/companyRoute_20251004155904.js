import { supabase } from "../config/supabase.js";

const addCompany =async(req,res)=>{

     try{
        
        const {name,website,description} = req.body;

      const { data, error } = await supabase
      .from("companies")
      .insert([{ name, website, description }])
      .select();

      if(error) return res.status(400).json({success:false,message:"Please enter correct info"});
      res.status(201).json({success:true,message:data[0]});
     }
     catch(err){
      res.status(500).json({success:false,message:"External error"});
     }
}

const getCompanies= async(req,res)=>{

    try{
        const { data, error } = await supabase
      .from("companies")
      .select("*");

      if(error) return res.status(404).json({success:false,message:error.message});
      res.status(201).json({success:true,message:data});

    }
    catch(err){
        res.status(500).json({success:false,message:err.message});
    }
}

const getCompany =async(req,res)=>{
        try {
            const {id} = req.params;
      
      const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if(error) return res.status(404).json({success:false,message:error.message});

    res.json({ success: true, company: data });

  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
}

  const updateCompany=async(req,res)=>{
   
    try {
    const { id } = req.params;
    const { name, website, description } = req.body;

    const { data, error } = await supabase
      .from("companies")
      .update({ name, website, description, updated_at: new Date() })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({ success: true, company: data[0] });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }

}

   const deleteCompany=async(req,res)=>{

     try {
    const { id } = req.params;

    const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id);

    if (error) throw error;

    res.json({ success: true, message: "Company deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export {addCompany,getCompanies,getCompany,updateCompany,deleteCompany};