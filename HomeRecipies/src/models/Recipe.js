import { Schema, model, Types } from 'mongoose';

let recipeSchema = new Schema({
    title: {
        type: String,
        minLength: [2, 'Title should be at least 2 characters long!']
    },
    description: {
        type: String,
        minLength: [10, 'Description should be at least 10 characters long!'],
        maxLength: [100, 'The max length of the Description is 100 characters!']
    },
    ingredients: {
        type: String,
        minLength: [10, 'Ingredients should be at least 10 characters long!'],
        maxLength: [200, 'The max length of the Ingredients is 200 characters!']
    },
    instructions: {
        type: String,
        minLength: [10, 'Instructions should be at least 10 characters long!'],
    },
    imageUrl: {
        type: String,
        match: /^https?:\/\//
    },
    recommendedList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    creator: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

let Recipe = model('Recipe', recipeSchema);

export default Recipe;
