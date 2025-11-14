import { Router } from "express";
const router = Router();
import * as recipeImageController from '../controllers/recipeImageController.js';
import { protect } from '../middleware/authMiddleware.js';

// GET /api/recipe-images/:imageId
router.get('/:imageId', recipeImageController.getRecipeImageById);

// DELETE /api/recipe-images/:imageId
router.delete('/:imageId', protect, recipeImageController.deleteRecipeImage);

export default router;