import { Router } from "express";
import { addCompany, deleteCompany, getCompanies, getCompany, updateCompany } from "../controllers/companyController.js";
import authMiddleware from "../middlewares/auth.js";

const companyRouter = Router();

// All routes protected
companyRouter.post('/add', authMiddleware, addCompany);
companyRouter.get('/get', authMiddleware, getCompanies);
companyRouter.post('/get/:id', authMiddleware, getCompany);
companyRouter.put('/update/:id', authMiddleware, updateCompany);
companyRouter.delete('/delete/:id', authMiddleware, deleteCompany);

export default companyRouter;