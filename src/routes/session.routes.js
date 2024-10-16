import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { register, login, logout, getCurrentUser, githubCallback } from '../controllers/user.controller.js';
import passport from 'passport';

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current", isAuthenticated, getCurrentUser);
router.get("/user", isAuthenticated, getCurrentUser);

// Añade esta nueva ruta
router.get("/check-auth", isAuthenticated, (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), githubCallback);

export default router;