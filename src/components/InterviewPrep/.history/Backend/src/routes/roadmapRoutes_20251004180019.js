import { Router } from "express";
import {generateRoad_map, saveRoadmap, getUserRoadmaps, getARoadmap, updateRoadMap} from '../controllers/roadmapControllers.js'
import authMiddleware from "../middlewares/auth.js";

const roadmapRouter = Router();

roadmapRouter.post("/generate/:userId", generateRoad_map);
roadmapRouter.post("/save",authMiddleware, saveRoadmap);
roadmapRouter.get("/user/:id",authMiddleware, getUserRoadmaps);
roadmapRouter.get("/:id",authMiddleware, getARoadmap);
roadmapRouter.patch("/:id/progress",authMiddleware, updateRoadMap);

export default roadmapRouter;