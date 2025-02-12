import { Router } from 'express';
import Recipe from '../models/Recipe.js';
import recipeService from '../services/recipeService.js';
import { getErrorMessage } from '../utilis/errorUtilis.js';
import { isAuth } from '../middlewares/authMiddleware.js';

let router = Router();

router.get('/create', isAuth, (req, res) => {
    res.render('create');
});

router.post('/create', isAuth, async (req, res) => {
    let createdRecipeData = req.body;
    let userId = req.user?.id;

    try {
        await recipeService.create(createdRecipeData, userId);
        res.redirect('/');
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('create', { recipeData: createdRecipeData, error });
    }
});

router.get('/catalog', async (req, res) => {
    try {
        let recipe = await recipeService.getLatestRecipe({});

        res.render('catalog', { recipe });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('catalog', { error });
    }
});

router.get('/:id/details', async (req, res) => {
    let id = req.params.id;

    try {
        let recipeData = await recipeService.getOne(id);
        let isCreator = recipeData.creator?.equals(req.user?.id);
        let userId = req.user?.id;
        let hasRecommended = Array.isArray(recipeData.recommendedList) && recipeData.recommendedList.includes(userId);
        let recommendedCount = recipeData.recommendedList.length;
        res.render('details', { recipeData, isCreator, hasRecommended,recommendedCount });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render(`details`, { recipeData, error });
    }
});

router.get('/:id/delete', isAuth, async (req, res) => {
    let id = req.params.id;

    try {
        let recipeData = await recipeService.getOne(id);

        if (!recipeData.creator?.equals(req.user?.id)) {
            let userError = 'You should be the creator in order to do that!';

            return res.render('details', { userError });
        }

        await recipeService.delete(id);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }

    res.redirect('/');
});

router.get('/:id/edit', async (req, res) => {
    let id = req.params.id;

    try {
        let recipeData = await recipeService.getOne(id);

        res.render('edit', { recipeData });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('edit', { recipeData, error });
    }
});

router.post('/:id/edit', isAuth, async (req, res) => {
    let id = req.params.id;
    let recipeData = req.body;

    try {
        let recipeObj = await recipeService.getOne(id);

        if (!recipeObj.creator?.equals(req.user?.id)) {
            let userError = 'You should be the creator in order to do that!';

            return res.render('edit', { recipeData, userError });
        }

        await recipeService.update(id, recipeData);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('edit', { recipeData, error });
    }
    res.redirect(`/${id}/details`);
});

router.get('/search', async (req, res) => {
    let query = req.query;

    try {
        let recipe = await recipeService.getAll(query);

        res.render('search', { recipe, query });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('search', { query, error });
    }
});

router.get('/:id/recommend', isAuth, async (req, res) => {
    let recipeId = req.params.id;
    let userId = req.user?.id;
    let recipe = await recipeService.getOne(recipeId);
    try {
        await recipeService.recommend(recipeId, userId);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { recipe, error });
    }
    res.redirect(`/${recipeId}/details`);
});


export default router;