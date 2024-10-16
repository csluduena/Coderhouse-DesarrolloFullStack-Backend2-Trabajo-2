import { Router } from 'express';
import { register, login, getProfile, updateProfile, deleteUser } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfile);
router.delete('/', isAuthenticated, deleteUser);

export default router;