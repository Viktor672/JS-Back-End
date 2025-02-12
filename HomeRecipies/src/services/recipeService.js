import Recipe from '../models/Recipe.js';
import { getErrorMessage } from '../utilis/errorUtilis.js';

export default {
    getOne(recipeId) {
        let recipeQuery = Recipe.findById(recipeId);

        if (Object.keys(recipeQuery).length <= 0) {
            throw new Error('This recipe does not have details');
        }

        return recipeQuery;
    },
    async getAll(query) {
        let recipe = Recipe.find({});

        if (query.search) {
            recipe = recipe.find({ title: { $regex: query.search, $options: 'i' } });
        }

        return recipe;

    },
    async create(recipeData, creatorId) {
        return await Recipe.create({
            ...recipeData,
            creator: creatorId
        });
    },
    getLatestRecipe() {
        return Recipe.find({}).sort({ _id: 'desc' }).limit(3);
    },
    async recommend(recipeId, userId) {
        let recipe = await Recipe.findById(recipeId);

        if (recipe.creator.equals(userId)) {
            throw new Error('You cannot recommend your own recipe!');
        }

        if (recipe.recommendedList.includes(userId)) {
            throw new Error('You have already recommended this recipe!');
        }

        await Recipe.findByIdAndUpdate(recipeId, { $push: { recommendedList: userId } });
    },
    delete(recipeId) {
        return Recipe.findByIdAndDelete(recipeId);
    },
    update(recipeId, recipeData) {
        return Recipe.findByIdAndUpdate(recipeId, recipeData, { runValidators: true });
    }
}