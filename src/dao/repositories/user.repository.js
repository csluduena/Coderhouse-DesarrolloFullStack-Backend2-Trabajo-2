import User from '../models/user.model.js';
import { UserDTO } from '../../dto/user.dto.js';

export class UserRepository {
    async findById(id) {
        const user = await User.findById(id);
        return user ? new UserDTO(user) : null;
    }

    async findByEmail(email) {
        const user = await User.findOne({ email });
        return user ? new UserDTO(user) : null;
    }

    async create(userData) {
        const user = new User(userData);
        await user.save();
        return new UserDTO(user);
    }

    async update(id, updateData) {
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        return user ? new UserDTO(user) : null;
    }

    async delete(id) {
        const user = await User.findByIdAndDelete(id);
        return user ? new UserDTO(user) : null;
    }
}
