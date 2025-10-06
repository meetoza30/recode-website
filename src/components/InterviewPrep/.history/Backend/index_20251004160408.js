import express from "express";
import cors from "cors";
import 'dotenv/config';

const app = express();
const port =  process.env.PORT || 4000;

app.use(cors());        
app.use(express.json());  


// API Endpoints
import userRouter from "./src/routes/userRoute.js";
import companyRouter from "./src/routes/companyRoute.js";
import interviewExperienceRouter from "./src/routes/interviewExperienceRoute.js";
import savedArticleRouter from "./src/routes/savedArtcileRoute.js";
import roadmapRouter from "./src/routes/roadmapRoutes.js";

app.use('/api/users', userRouter);
app.use('/api/companies', companyRouter);
app.use('/api/interview', interviewExperienceRouter);
app.use('/api/saved-articles', savedArticleRouter);
app.use('/api/roadmap', roadmapRouter);

app.listen(port ,()=>{
    console.log(`Server running on port ${port}`);
})