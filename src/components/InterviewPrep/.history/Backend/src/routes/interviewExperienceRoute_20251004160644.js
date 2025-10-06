import { Router } from "express";
import { addInterviewExperience, getAllInterviewExperiences, getInterviewExperience,
  getCompanyInterviewExperiences, updateInterviewExperience, deleteInterviewExperience, addView, getRecommendedExperiencesKNN ,
getMyInterviewExperiences} from "../controllers/interviewExperienceController.js";
import authMiddleware from "../middlewares/auth.js";

const interviewRouter = Router();

// All routes protected with authMiddleware
interviewRouter.post("/add", authMiddleware, addInterviewExperience);
interviewRouter.get("/gets", authMiddleware, getAllInterviewExperiences);           // ADDED authMiddleware
interviewRouter.get("/gets/knn", getRecommendedExperiencesKNN);    // ADDED authMiddleware
interviewRouter.get("/gets/:id", authMiddleware, getInterviewExperience);
interviewRouter.get("/company/:companyId", authMiddleware, getCompanyInterviewExperiences);
interviewRouter.put("/update/:id", authMiddleware, updateInterviewExperience);
interviewRouter.delete("/delete/:id", authMiddleware, deleteInterviewExperience);
interviewRouter.patch("/view/:id", authMiddleware, addView);
interviewRouter.get("/my-experiences",authMiddleware, getMyInterviewExperiences);

export default interviewRouter;