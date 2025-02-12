import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

let userSchema = new Schema ({
    name: {
        type: String,
        minLength: [2, 'Name should be at least 2 characters long!'],
        maxLength: [20, 'The max length of the name is 20 characters!']
    },
    email: {
        type: String,
        minLength: [10, 'Email should be at least 10 characters long!']
    },
    password: {
        type: String,
        minLength: [4, 'Password should be at least 4 characters long!']
    }
});

userSchema.virtual('rePassword').set(function (rePassword) {
    if (this.password !== rePassword) {
        throw new Error('Passwords must be the same!');
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

let User = model('User', userSchema);

export default User;
