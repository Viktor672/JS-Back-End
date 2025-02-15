import { Schema, model, Types } from 'mongoose';

let wizardSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, 'Name should be at least 2 characters long!']
    },
    species: {
        type: String,
        required: true,
        minLength: [3, 'Species should be at least 3 characters long!']
    },
    skinColor: {
        type: String,
        required: true,
        minLength: [3, 'Skin color should be at least 3 characters long!']
    },
    eyeColor: {
        type: String,
        required: true,
        minLength: [3, 'Eye color should be at least 3 characters long!']
    },
    image: {
        type: String,
        required: true,
        match: [/^https?:\/\//, 'Image should start with http:// or https://']
    },
    description: {
        type: String,
        required: true,
        minLength: [5, 'Description color should be at least 5 characters long!'],
        maxLength: [500, 'The max length of the description is 500 characters!']
    },
    votes: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

export let Wizard = model('Wizard', wizardSchema);