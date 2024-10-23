import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { register, login, logout, getCurrentUser, githubCallback } from '../controllers/user.controller.js';
import passport from 'passport';

const router = Router();

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Login user
 *     tags: [Users Session]
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
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/session/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Users Session]
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

router.get("/check-auth", isAuthenticated, (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), githubCallback);

export default router;