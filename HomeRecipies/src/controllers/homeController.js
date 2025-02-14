import { Router } from 'express';
import Recipe from '../models/Recipe.js';
import recipeService from '../services/recipeService.js';
import { getErrorMessage } from '../utilis/errorUtilis.js';

let router = Router();

router.get('/', async (req, res) => {
    try {
        let recipe = await recipeService.getLatestRecipe();

        res.render('home', { recipe });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('404', { error });
    }
});

router.get('/about', (req, res) => {
    res.render('about');
});

export default router;