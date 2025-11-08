import { Router } from 'express';
import userRoutes from "./userRoutes.js"
import recipeRoutes from './recipeRoutes.js';
const router = Router();

router.use('/recipes',recipeRoutes);
router.use('/users', userRoutes)


router.get('/', (req, res) => {
    res.status(200).json({message: "API Rodando"})
})

export default router;