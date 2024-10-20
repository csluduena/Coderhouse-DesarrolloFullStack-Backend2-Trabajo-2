import User from '../dao/models/user.model.js';
import Cart from '../dao/models/cart.model.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js'



import { UserRepository } from '../dao/repositories/user.repository.js';
import { UserDTO } from '../dto/user.dto.js';

config();

const jwtSecret = process.env.JWT_SECRET;
const userRepository = new UserRepository();

export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        const user = await userRepository.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ user: new UserDTO(user) });
    } catch (error) {
        console.error('Error en getCurrentUser:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(ERROR_CODES.BAD_REQUEST).json({
                message: ERROR_MESSAGES.USER_ALREADY_EXISTS
            });
        }

        const user = new User({ first_name, last_name, email, age, password });
        await user.save();

        const newCart = new Cart({ user: user._id, items: [] });
        await newCart.save();

        user.cart = newCart._id;
        await user.save();

        const token = jwt.sign(
            {
                userId: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.cart
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        req.user = user;

        const userInfo = {
            userId: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart

        };

        // Enviar respuesta con la URL de redirección
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: userInfo,
            token: token,
            redirectUrl: '/current'
        });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !await user.comparePassword(password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.cart
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        req.user = user;

        req.login(user, (err) => {
            if (err) {
                console.error('Error in req.login:', err);
                return res.status(500).json({ message: 'Error logging in' });
            }
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    userId: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    role: user.role,
                    cart: user.cart
                },
                token: token,
                redirectUrl: '/current'
            });
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout exitoso', redirectUrl: '/login' });
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        res.json(user);
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, email, age } = req.body;
        const user = await User.findByIdAndUpdate(req.user.userId,
            { first_name, last_name, email, age },
            { new: true }
        ).select('-password');
        if (!user) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        res.json(user);
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.userId);
        if (!deletedUser) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        res.clearCookie('token');
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const githubCallback = (req, res) => {
    const token = jwt.sign(
        {
            userId: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart
        },
        jwtSecret,
        { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.redirect('/current');
    req.user = User;
};



