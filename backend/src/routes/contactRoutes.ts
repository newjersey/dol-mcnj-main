import express from "express";
import { submitContactForm } from "../controllers/contactController";

const router = express.Router();


router.post("/", submitContactForm);

export default router;