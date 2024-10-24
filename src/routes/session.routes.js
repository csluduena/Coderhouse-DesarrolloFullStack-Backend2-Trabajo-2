import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { register, login, logout, getCurrentUser, githubCallback, googleCallback } from '../controllers/user.controller.js';
import passport from 'passport';

const router = Router();

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Login user
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login su
 *       401:
 *         description: Invalid 
 *       500:
 *         description: Internal
 */
router.post('/login', login);

/**
 * @swagger
 * /api/sessions/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post("/logout", logout);

router.get("/current", isAuthenticated, getCurrentUser);

router.get("/user", isAuthenticated, getCurrentUser);

router.get("/check-auth", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// Rutas de autenticación con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), githubCallback);

// Rutas de autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);

export default router;