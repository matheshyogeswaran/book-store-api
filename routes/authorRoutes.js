import express from "express";
import { getAuthors, createAuthor, getAuthorById, updateAuthor, deleteAuthor } from "../controllers/authorController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();
router.get("/", verifyToken, getAuthors);
router.post("/", verifyToken, createAuthor);
router.get("/:id", verifyToken, getAuthorById);
router.put("/:id", verifyToken, updateAuthor);
router.delete("/:id", verifyToken, deleteAuthor);

export default router;