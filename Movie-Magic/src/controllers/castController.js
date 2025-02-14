import { Router } from 'express';
import castService from '../services/castService.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { getErrorMessage } from '../utilis/errorUtilis.js';

let router = Router();

router.use(isAuth);

router.get('/create', (req, res) => {
    res.render('cast/create');
});

router.post('/create', async (req, res) => {
    let castData = req.body;
    try {
        await castService.create(castData);
        res.redirect('/');
    }
    catch (err) {
        let error = getErrorMessage(err);
        res.render('cast/create', { cast: castData, error });
    }
});

export default router;