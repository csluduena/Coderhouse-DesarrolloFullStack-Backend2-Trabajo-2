import { Router } from 'express';
import { register, getProfile, updateProfile, deleteUser, changeUserRole } from '../controllers/user.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
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
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile', isAuthenticated, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/profile', isAuthenticated, updateProfile);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/', isAuthenticated, deleteUser);

/**
 * @swagger
 * /api/users/{userId}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user whose role is to be updated
 *         schema:
 *           type: string
 *           example: 671963ae605cfefb3818d2ed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/:uid/role', isAuthenticated, isAdmin, changeUserRole);


export default router;
