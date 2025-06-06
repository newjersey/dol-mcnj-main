import express from "express";
import { submitSignupForm } from "../controllers/signUpController";
import { validateSignupForm } from '../middleware/signUpValidations';

const router = express.Router();


router.post("/", validateSignupForm, submitSignupForm);

export default router;