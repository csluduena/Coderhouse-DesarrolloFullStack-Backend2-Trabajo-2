import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

config();

const jwtSecret = process.env.JWT_SECRET;

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(ERROR_CODES.FORBIDDEN).json({ message: ERROR_MESSAGES.ADMIN_REQUIRED });
    }
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        res.status(ERROR_CODES.FORBIDDEN).json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
    }
};

export const checkUserSession = (req, res, next) => {
    const token = req.cookies['token'];

    if (!token) {
        res.locals.user = null;
        return next();
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            res.locals.user = null;
            return next();
        }

        req.user = decoded;
        res.locals.user = decoded;
        return next();
    });
};