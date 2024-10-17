import mongoose from 'mongoose';
import User from '../dao/models/user.model.js';
import { config } from 'dotenv';

config();

const MONGODB_URI = process.env.MONGODB_URI;

async function setAdmin(userId) {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado a MongoDB');

        const user = await User.findById(userId);
        if (!user) {
            console.log('Usuario no encontrado');
            return;
        }

        user.role = 'admin';
        await user.save();

        console.log(`Rol de administrador asignado al usuario ${user.email}`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

const userId = process.argv[2];
if (!userId) {
    console.log('Por favor, proporciona un ID de usuario');
} else {
    setAdmin(userId);
}

/* EJECUTAR:

node src/utils/setAdmin.js <userId>

*/