import { Router } from "express";
import { registerUser, loginUser, getUserById, getAllUsers, updateUserProfile, quizScore } from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post('/register', registerUser); // open route
userRouter.post('/login', loginUser);       // open route

// Protected routes
userRouter.post('/profile/:id', authMiddleware, updateUserProfile);
userRouter.get('/get/:id', getUserById);
userRouter.get('/gets', getAllUsers);
userRouter.patch('/score/:id',quizScore);

export default userRouter;