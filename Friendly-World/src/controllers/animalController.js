import { Router } from 'express';
import animalService from '../services/animalService.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';
import { isAuth } from '../middlewares/authMiddleware.js';

let router = Router();

router.get('/create', isAuth, (req, res) => {
    res.render('create');
});

router.post('/create', isAuth, async (req, res) => {
    let animalData = req.body;
    let userId = req.user?.id;

    try {
        await animalService.create(animalData, userId);
        res.redirect('/catalog');
    }
    catch (err) {
        let error = getErrorMessage(err);
        console.log(animalData.location);


        res.render('create', { animalData, error });
    }
});

router.get('/:id/details', async (req, res) => {
    let id = req.params.id;

    try {
        let animalData = await animalService.getOne(id);
        let isOwner = animalData.owner?.equals(req.user?.id);
        let userId = req.user?.id;
        let hasDonated = Array.isArray(animalData.donations) && animalData.donations.includes(userId);

        res.render('details', { animalData, isOwner, hasDonated });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }
});

router.get('/:id/delete', isAuth, async (req, res) => {
    let id = req.params.id;
    try {
        await animalService.deleteData(id);

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
        let animalData = await animalService.getOne(id);

        res.render('edit', { animalData });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('edit', { animalData, error });
    }
});

router.post('/:id/edit', isAuth, async (req, res) => {
    let id = req.params.id;

    try {
        let animalData = await req.body;
        let animal = await animalService.getOne(id);

        if (!animal.owner?.equals(req.user?.id)) {
            let userError = 'You should be the creator in order to do that!';

            res.render('edit', { animalData, userError });
        }

        await animalService.updateData(id, animalData);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('edit', { animalData, error });
    }
    res.redirect(`/${id}/details`);
});

router.get('/search', async (req, res) => {
    let query = req.query;
    console.log(query);
    

    try {
        let animal = await animalService.getAll(query);
console.log(animal);

        res.render('search', { animal, query });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('search', { query, error });
    }
});

router.get('/:id/donate', isAuth, async (req, res) => {
    let animalId = req.params.id;
    let userId = req.user?.id;

    try {
        await animalService.donate(animalId, userId);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }

    res.redirect(`/${animalId}/details`);
});


export default router;