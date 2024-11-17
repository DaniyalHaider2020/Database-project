import express from "express";
import { getComments, addComments, getComval } from "../Controllers/comment.js";

const router = express.Router();

router.get("/", getComments);
router.get("/comm/", getComval)
router.post("/", addComments);

export default router;