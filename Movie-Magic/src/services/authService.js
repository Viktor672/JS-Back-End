import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let SECRET = 'SOMESECRET';

export default {
    register(userData) {
        return User.create(userData);
    },
    async login(email, password) {
        let userObj = await User.findOne({ email });
        console.log(email);

        if (!userObj.email) {   //possible error
            throw new Error('Invalid email or password!');
        }

        let isPasswordValid = await bcrypt.compare(password, userObj.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password!');
        }

        let payload = {
            id: userObj.id,
            email: userObj.email
        }

        let token = jwt.sign(payload, SECRET, { expiresIn: '3h' });

        return token;
    }
}