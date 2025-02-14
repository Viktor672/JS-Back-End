import { Schema, model, Types } from 'mongoose';

let volcanoSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, 'Name should be at least 2 characters long!']
    },
    location: {
        type: String,
        required: true,
        minLength: [3, 'Location should be at least 3 characters long!']
    },
    elevation : {
        type: Number,
        required: true,
        min: [0, 'Elevation should be at least 0!']
    },
    lastEruption: {
        type: Number,
        required: true,
        min: [0, 'Year of Last Eruption should be equal or older than 0!'],
        max: [2024, 'Year of Last Eruption should not be older than 2024!']
    },
    image: {
        type: String,
        required: true,
        match: [/^https?:\/\//, 'Volcano image should shart with http:// or https://']
    },
    typeVolcano: {
        type: String,
        required: true,
        enum: [
            'Supervolcanoes',
            'Submarine',
            'Subglacial',
            'Mud',
            'Stratovolcanoes',
            'Shield'],
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'Description should be at least 10 characters long!']
    },
    voteList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
});


export let Volcano = model('Volcano', volcanoSchema); 