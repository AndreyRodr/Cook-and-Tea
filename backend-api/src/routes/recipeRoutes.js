import { Router } from "express";
const recipeRoutes = Router();
import * as recipeController from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js'

//GET /api/recipes/
recipeRoutes.get('/', recipeController.getAllRecipes);

//GET /api/recipes/search?q=...
recipeRoutes.get('/search', recipeController.getRecipeByName);

//GET /api/recipes/author/:userId
recipeRoutes.get('/author/:userId', recipeController.getRecipeByAuthor);

//GET /api/recipes/tag/:tagname
recipeRoutes.get('/tag/:tagname', recipeController.getRecipeByTag);

//GET /api/recipes/:id
recipeRoutes.get('/:id', recipeController.getRecipeById);

//POST /api/recipes/
recipeRoutes.post(
    '/',
    protect,
    recipeController.createRecipe);

//PUT /api/recipes/:id
recipeRoutes.put('/:id', protect, recipeController.updateRecipe);

//DELETE /api/recipes/:id
recipeRoutes.delete("/:id", protect, recipeController.deleteRecipe);

export default recipeRoutes;