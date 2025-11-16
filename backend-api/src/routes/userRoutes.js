import { Router } from "express";
const router = Router();
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// POST /api/users/current/profile-pic (Upload da foto do usuário logado)
router.post(
    '/current/profile-pic',
    protect, // Garante que o usuário está logado (pega req.user)
    upload.single('profilePic'), // Processa o arquivo ('profilePic' é o nome do campo do form)
    userController.uploadProfilePic
);

// GET /api/users/:userId/profile-pic (Ver a foto de qualquer usuário)
router.get('/:userId/profile-pic', userController.getProfilePic);

// GET /api/users/:id
router.get('/:userId', userController.getUserById)


// GET /api/users/current/favorites
// POST /api/users/current/favorites
router.route('/current/favorites')
.get(protect, userController.listFavorites)   
.post(protect, userController.addFavorite);

// DELETE /api/users/current/favorites/:recipeId
router.route('/current/favorites/:recipeId')
    .delete(protect, userController.removeFavorite); 

export default router;