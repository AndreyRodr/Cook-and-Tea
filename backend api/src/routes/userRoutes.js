import { Router } from "express";
const router = Router();
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'


// GET /api/users
router.get('/', userController.getAllUsers)

// POST /api/users
router.post('/', userController.createUser)

// GET /api/users/current
router.get('/current', protect, userController.getCurrentUser)

// PUT /api/users/current
router.put('/current', protect, userController.updateCurrentUser)

// DELETE /api/users/current
router.delete('/current', protect, userController.deleteCurrentUser)

// GET /api/users/:id
router.get('/:userId', userController.getUserById)

export default router;