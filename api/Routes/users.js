import express from "express";
import { getUser,updateUser } from "../Controllers/users.js";

const router = express.Router();

router.get("/find/:userID", getUser);
router.put("/", updateUser);

export default router;