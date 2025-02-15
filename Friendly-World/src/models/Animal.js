import { Schema, model, Types } from 'mongoose';

let animalSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, 'Name should be at least 2 characters long!']
    },
    years: {
        type: Number,
        required: true,
        min: [1, 'Year should be higher or equal than 1'],
        max: [100, 'Year should not be higher than 100'],
    },
    kind: {
        type: String,
        required: true,
        minLength: [3, 'Kind should be at least 3 characters long!']
    },
    image: {
        type: String,
        required: true,
        match: [/^https?:\/\//, 'Photo image should shart with http:// or https://']
    },
    need: {
        type: String,
        required: true,
        minLength: [3, 'Need should be at least 3 characters long!'],
        maxLength: [20, 'The max length of the need is 20 characters!']
    },
    location: {
        type: String,
        required: true,
        minLength: [5, 'Location should be at least 5 characters long!'],
        maxLength: [15, 'The max length of the location is 15 characters!']
    },
    description: {
        type: String,
        required: true,
        minLength: [5, 'Description should be at least 5 characters long!'],
        maxLength: [50, 'The max length of the description is 50 characters!']
    },
    donations: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
});


export let Animal = model('Animal', animalSchema); 