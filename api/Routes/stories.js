import express from "express";
import { addStory, getStory } from "../Controllers/stories.js";

const router = express.Router();

router.put("/", addStory)
router.get("/", getStory);

export default router;