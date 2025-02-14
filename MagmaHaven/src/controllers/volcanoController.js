import { Router } from 'express';
import { Volcano } from '../models/Volcano.js';
import volcanoService from '../services/volcanoService.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { get } from 'mongoose';

let router = Router();

router.get('/create', isAuth, (req, res) => {
    let categories = getCategoriesData();
    res.render('create', { categories });
});

router.post('/create', isAuth, async (req, res) => {
    let volcanoData = req.body;
    let userId = req.user?.id;

    try {
        await volcanoService.create(volcanoData, userId);
        res.redirect('/catalog');
    }
    catch (err) {
        let error = getErrorMessage(err);
        let categories = getCategoriesData(volcanoData.typeVolcano);
        console.log(volcanoData.typeVolcano);


        res.render('create', { volcanoData, categories, error });
    }
});

router.get('/:id/details', async (req, res) => {
    let id = req.params.id;

    try {
        let volcanoData = await volcanoService.getOne(id);
        let isOwner = volcanoData.owner?.equals(req.user?.id);
        let userId = req.user?.id;
        let hasVoted = Array.isArray(volcanoData.voteList) && volcanoData.voteList.includes(userId);
        let voteCount = volcanoData.voteList.length;

        res.render('details', { volcanoData, isOwner, hasVoted, voteCount });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }
});

router.get('/:id/delete', isAuth, async (req, res) => {
    let id = req.params.id;
    try {
        await volcanoService.deleteData(id);

        res.redirect('/catalog');
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }
});

router.get('/:id/edit', isAuth, async (req, res) => {
    let id = req.params.id;

    try {
        let volcanoData = await volcanoService.getOne(id);
        let categories = getCategoriesData(volcanoData.typeVolcano);

        res.render('edit', { volcanoData, categories });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('edit', { volcanoData, error });
    }
});

router.post('/:id/edit', isAuth, async (req, res) => {
    let id = req.params.id;

    try {
        let volcanoData = await req.body;
        let volcano = await volcanoService.getOne(id);

        if (!volcano.owner?.equals(req.user?.id)) {
            let userError = 'You should be the creator in order to do that!';

            res.render('edit', { volcanoData, userError });
        }

        await volcanoService.updateData(id, volcanoData);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('edit', { volcanoData, error });
    }
    res.redirect(`/${id}/details`);
});

router.get('/search', async (req, res) => {
    let query = req.query;

    try {
        let volcano = await volcanoService.getAll(query);

        let categories = getCategoriesData(query.typeVolcano);

        res.render('search', { volcano, query, categories });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('search', { query, error });
    }
});

router.get('/:id/vote', async (req, res) => {
    let volcanoId = req.params.id;
    let userId = req.user?.id;

    try {
        await volcanoService.vote(volcanoId, userId);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }

    res.redirect(`/${volcanoId}/details`);
});

function getCategoriesData(category) {
    let categoriesData = {
        'Supervolcanoes': 'Supervolcanoes',
        'Submarine': 'Submarine',
        'Subglacial': 'Subglacial',
        'Mud': 'Mud',
        'Stratovolcanoes': 'Stratovolcanoes',
        'Shield': 'Shield'
    }

    let categories = Object.keys(categoriesData).map(key => ({
        value: key,
        label: categoriesData[key],
        selected: key === category ? 'selected' : ''
    }));

    return categories;
}

export default router;