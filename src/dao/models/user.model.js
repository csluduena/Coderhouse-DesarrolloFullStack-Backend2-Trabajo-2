import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: {
        type: String,
        required: function () {
            return this.provider === 'local'; // Solo es requerido si el proveedor es 'local'
        }
    },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    provider: {
        type: String,
        required: true,
        enum: ['local', 'google', 'github'],
        default: 'local' // Si no se especifica, será 'local'
    }
}, { timestamps: true });

// Middleware para hashear la contraseña solo si el proveedor es 'local'
userSchema.pre('save', async function (next) {
    if (this.provider !== 'local' || !this.isModified('password')) return next(); // Si no es 'local', no hashees
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Método para comparar contraseñas solo si el proveedor es 'local'
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (this.provider !== 'local') {
        throw new Error('La contraseña no está disponible para este proveedor');
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
