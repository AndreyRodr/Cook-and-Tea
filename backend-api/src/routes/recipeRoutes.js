import { Router } from "express";
const recipeRoutes = Router();
import * as recipeController from '../controllers/recipeController.js';

import { protect, protectChef } from '../middleware/authMiddleware.js'
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    protectChef,
    upload.array('recipeImages', 5), // Até 5 imagens por receita
    recipeController.createRecipe);

//PUT /api/recipes/:id
recipeRoutes.put(
    '/:id', 
    protect,
    upload.array('recipeImages', 5), recipeController.updateRecipe);

//DELETE /api/recipes/:id
recipeRoutes.delete("/:id", protect, recipeController.deleteRecipe);

export default recipeRoutes;