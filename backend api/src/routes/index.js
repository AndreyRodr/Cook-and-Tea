import { Router } from 'express';
// import recipeRoutes from './receitaRoutes';
import userRoutes from "./userRoutes.js"

const router = Router();

// router.use('/recipe',recipeRoutes);
router.use('/users', userRoutes)

router.get('/', (req, res) => {
    res.status(200).json({message: "API Rodando"})
})

export default router;