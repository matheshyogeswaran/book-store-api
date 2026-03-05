import express from "express";
import { getGenres, createGenre } from "../controllers/genreController.js";
import verifyToken from "../middleware/auth.js";
import { getGenreById } from "../controllers/genreController.js";
import { updateGenre } from "../controllers/genreController.js";
import { deleteGenre } from "../controllers/genreController.js";

const router = express.Router();
router.get("/", verifyToken, getGenres);
router.post("/", verifyToken, createGenre);
router.get("/:id", verifyToken, getGenreById);
router.put("/:id", verifyToken, updateGenre);
router.delete("/:id", verifyToken, deleteGenre);


export default router;