import { Schema, model, Types } from 'mongoose';

let movieSchema = new Schema({
    title: {
        type: String,
        minLength: [5, 'Title should be at least 5 characters long!'],
        maxLength: [250, 'Max length is 250 characters long!'],
        required: [true, 'Title is required!'],
        match: [/^[ a-zA-Z0-9]+$/, 'Title should be only English letters, digits, and whitespaces']
    },
    category: {
        type: String,
        required: true,
        enum: [
            'tv-show',
            'animation',
            'movie',
            'documentary',
            'short-film',
        ]
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        minLength: [5, 'Genre should be at least 5 characters long!'],
        maxLength: [250, 'Max length is 250 characters long!'],
        match: [/^[ a-zA-Z0-9]+$/, 'Genre should be only English letters, digits, and whitespaces']
    },
    director: {
        type: String,
        minLength: [5, 'Director should be at least 5 characters long!'],
        maxLength: [250, 'Max length is 250 characters long!'],

    },
    year: {
        type: Number,
        min: 1900,
        max: 2025
    },
    imageUrl: {
        type: String,
        match: /^https?:\/\//
    },
    rating: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
    },
    description: {
        type: String,
        minLength: 20,
        match: [/^[ a-zA-Z0-9,.!?-]+$/, 'Description should be only English letters, digits, and whitespaces'],
        trim:true
    },
    casts: [{
        type: Types.ObjectId,
        ref: 'Cast'
    }],
    creator: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

let Movie = model('Movie', movieSchema);

export default Movie;