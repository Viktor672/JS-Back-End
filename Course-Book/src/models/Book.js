import { Schema, model, Types } from 'mongoose';

let bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: [5, 'Title should be at least 5 characters long!']
    },
    type: {
        type: String,
        required: true,
        minLength: [3, 'Type should be at least 3 characters long!']
    },
    certificate: {
        type: String,
        required: true,
        minLength: [2, 'Certificate should be at least 2 characters long!']
    },
    image: {
        type: String,
        required: true,
        match: [/^https?:\/\//, 'Course image should shart with http:// or https://']
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'Description should be at least 10 characters long!']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price should be a positive number!']
    },
    signUpList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    },
});


export let Book = model('Book', bookSchema); 