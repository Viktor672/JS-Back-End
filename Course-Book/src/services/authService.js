import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utilities/authUtilities.js';

let register = async (userData) => {
    let userId = await User.findOne({ email: userData.email }).select({ _id: 1 });
console.log(userId);

    if (userId) {
        throw new Error('This user already exists!');
    }

    let createdUser = await User.create(userData);

    let token = generateToken(createdUser);

    return token;
}

let login = async (email, password) => {
    let userData = await User.findOne({ email });

    if (!userData.email) {
        throw new Error('Invalid email or password!');
    }

    let isPassword = await bcrypt.compare(password, userData.password);

    if (!isPassword) {
        throw new Error('Invalid email or password!');
    }

    let token = generateToken(userData);

    return token;
}

export default {
    register,
    login
}