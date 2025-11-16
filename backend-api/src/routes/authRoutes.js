import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRoutes = Router();

// POST /api/auth/login
authRoutes.post('/login', authController.login);

// POST /api/auth/login
authRoutes.post('/logout', authController.logout);

export default authRoutes;