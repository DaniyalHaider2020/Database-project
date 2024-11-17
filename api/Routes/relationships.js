import express from "express";
import { getRelationships, addRelationship, deleteRelationship, getFollowing, getMutual } from "../Controllers/relationships.js";

const router = express.Router()

router.get("/", getRelationships)
router.get("/mutual/:id", getMutual)
router.get("/following", getFollowing)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)


export default router