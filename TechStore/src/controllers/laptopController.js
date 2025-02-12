import { Router } from 'express';
import laptopService from '../services/laptopService.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { getErrorMessage } from '../utilis/errorUtilis.js';
import Laptop from '../models/Laptop.js';

let router = Router();

router.get('/create', isAuth, (req, res) => {
    res.render('create');
});

router.post('/create', isAuth, async (req, res) => {
    let newLaptopData = req.body;
    let userId = req.user?.id;
    console.log(req.user);

    try {
        await laptopService.create(newLaptopData, userId);
        res.redirect('/');
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('create', { laptopData: newLaptopData, error });
    }
});

router.get('/:id/details', async (req, res) => {
    let laptopId = req.params.id;
    let userId = req.user?.id;

    try {
        let laptopData = await laptopService.getOne(laptopId);
        let isCreator = laptopData.creator?.equals(userId);
        let hasPreferred = Array.isArray(laptopData.preferredList) && laptopData.preferredList.includes(userId);

        res.render('laptop/details', { laptopData, isCreator, hasPreferred });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('laptop/details', { laptopData,error });
    }
});

router.get('/catalog', async (req, res) => {
    try {
        let laptopArr = await laptopService.getLatestLaptop();
        console.log(laptopArr);

        res.render('catalog', { laptopArr });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('catalog', { error });
    }
});

router.get('/:id/delete', isAuth, async (req, res) => {
    let id = req.params.id;
    let laptop = await laptopService.getOne(id);

    if (!laptop.creator?.equals(req.user?.id)) {
        res.redirect('404');
    }

    try {
        await laptopService.delete(id);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.redirect('404', { error });
    }
    res.redirect('/');
});

router.get('/:id/edit', isAuth, async (req, res) => {
    let id = req.params.id;

    try {
        let laptopData = await laptopService.getOne(id);

        res.render('laptop/edit', { laptopData });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('laptop/edit', { laptopData, error });
    }
});

router.post('/:id/edit', isAuth, async (req, res) => {
    let id = req.params.id;
    let laptopData = req.body;

    try {
        let laptopObj = await laptopService.getOne(id);
        let error = 'You should be creator in able to edit!';

        if (!laptopObj.creator) {
            // res.render('laptop/edit', { laptopData, error });
            return res.render('404', { error });
        }

        await laptopService.update(id, laptopData);
    }
    catch (err) {
        let errorMessage = getErrorMessage(err);

        return res.render('laptop/edit', { laptopData, errorMessage });
    }
    res.redirect(`/${id}/details`);
});

router.get('/:id/prefer', isAuth, async (req, res) => {
    let laptopId = req.params.id;
    let userId = req.user?.id;
    let laptop = await laptopService.getOne(laptopId);

    try {
        await laptopService.prefer(laptopId, userId);
        res.redirect(`/${laptopId}/details`);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('laptop/details', { laptop, error });
    }

});
export default router;