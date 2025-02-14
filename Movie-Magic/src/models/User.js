import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

let userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,   //It is not validator, it is index!!!
        lowercase: true,  //Sanitizer
        match: /\@[a-zA-Z]+.[a-zA-Z]+$/,
        minLength: [10, 'Email should be at least 10 characters!'],
    },
    password: {
        type: String,
        match: /^[a-zA-Z0-9]+$/,
        minLength: [6, 'Password should be at least 7 characters!'],
        trim: true //Sanitizer 
    }
});

userSchema.virtual('rePassword').set(function (rePassword) {
    if (rePassword !== this.password) {
        throw new Error('Passwords must be the same!');
    }
}
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

let User = model('User', userSchema);

export default User;