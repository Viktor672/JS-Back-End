import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utilis/authUtilis.js';

export default {
    async register(userData) {
        let userId = await User.findOne({ email: userData.email }).select({ _id: 1 });

        if (userId) {
            throw new Error('User already exists!');
        }

        let createdUser = await User.create(userData);

        let token = generateToken(createdUser);

        return token;
    },
    async login(email, password) {
        let userData = await User.findOne({ email });

        if (!userData.email) {
            throw new Error('Invalid email or password!');
        }

        let isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        let token = generateToken(userData);
        return token;
    }
}