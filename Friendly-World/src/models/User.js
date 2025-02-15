import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

let userSchema = new Schema({
    email: {
        type: String,
        required: true,
        minLength: [10, 'Email should be at least 10 characters long!']
    },
    password: {
        type: String,
        required: true,
        minLength: [4, 'Password should be at least 4 characters long!']
    }
});

userSchema.virtual('rePassword').set(function (rePassword) {
    this._rePassword = rePassword;
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    if (this.password !== this._rePassword) {
        throw new Error('Passwords must be the same!');
    }

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    catch (err) {
        next(err);
    }
});

export let User = model('User', userSchema);