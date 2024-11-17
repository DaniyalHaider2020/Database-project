import express from "express";
import { getPosts, addPost, deletePost, editPost, revertPost, truncateLogs } from "../Controllers/posts.js";

const router = express.Router();

router.get("/", getPosts)
router.post("/", addPost)
router.post("/Update", editPost)
router.delete("/:id", deletePost);
router.post("/revert/:id", revertPost);
router.post("/trunc/:id", truncateLogs);

export default router;