import { Router } from "express";
const avaliationRoutes = Router();
import * as avaliationController from "../controllers/avaliationController.js";
import { protect } from "../middleware/authMiddleware.js";

// POST /api/avaliations/
avaliationRoutes.post('/', protect, avaliationController.createAvaliation);

// GET /api/avaliations/recipe/:id
avaliationRoutes.get('/recipe/:id', avaliationController.getAvaliationsByRecipes);

// PUT /api/avaliations/:id
avaliationRoutes.put('/:id', protect, avaliationController.updateAvaliation);

// DELETE /api/avaliations/:id
avaliationRoutes.delete('/:id', protect, avaliationController.deleteAvaliation);

export default avaliationRoutes;