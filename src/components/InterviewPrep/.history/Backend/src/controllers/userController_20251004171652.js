import { supabase } from "../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password_hash: hashedPassword,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) return res.status(400).json({ error: error.message });

    const token = createToken(data[0].id);
    res.status(201).json({ success: true, token, user: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (error || users.length === 0) {
    return res.status(400).json("Invalid Credentials");
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) return res.status(400).json("Enter correct password");

  const token = createToken(user.id);

  await supabase
    .from("users")
    .update({ login_time: new Date().toISOString() })
    .eq("id", user.id);

  res.status(201).json({ success: true, token, user });
};


const getUserById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, graduation_year, branch, cgpa, skills,company_interest,role_interest")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "User not found" });
  res.status(200).json(data);
};

const getAllUsers = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, graduation_year, branch, cgpa, skills, company_interest,role_interest");

  if (error) return res.status(404).json({ error: "Users not found" });
  res.status(200).json(data);
};

const updateUserProfile = async (req, res) => {
  const { graduation_year, branch, cgpa, skills, company_interest,role_interest } = req.body;
  const { id } = req.params;

  const { data: user, error } = await supabase
    .from("users")
    .update({
      graduation_year, branch, cgpa, skills, company_interest,role_interest
    })
    .eq("id", id)
    .select("id, name, email, graduation_year, branch, cgpa, skills, company_interest,role_interest")
    .single();

  if (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: error.message });
  }

  res.status(200).json({ success: true, user });
};

const quizScore = async (req, res) => {
  const { id } = req.params;        
  const score = req.body.scores;           

  if (!id || typeof score !== "object") {
    return res.status(400).json({ error: "Missing id or invalid score data." });
  }

  const { data, error } = await supabase
    .from("users")
    .update({ quiz_score: score })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ message: "Quiz score updated.", data });
};

export {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUserProfile,
  quizScore
};