import express from "express";
import { getSearch } from "../Controllers/search.js";

const router = express.Router();

router.get("/", getSearch)

export default router;