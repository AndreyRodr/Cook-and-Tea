import { Router } from 'express';
import userRoutes from "./userRoutes.js"
import recipeRoutes from './recipeRoutes.js';
import avaliationRoutes from './avaliationRoutes.js'
import authRoutes from './authRoutes.js';
import recipeImageRoutes from './recipeImageRoutes.js';

const router = Router();

router.use('/recipes',recipeRoutes);
router.use('/users', userRoutes);
router.use('/avaliations', avaliationRoutes);
router.use('/auth', authRoutes);
router.use('/recipe-images', recipeImageRoutes);

router.get('/', (req, res) => {
    res.status(200).json({message: "API Rodando"});
});

export default router;