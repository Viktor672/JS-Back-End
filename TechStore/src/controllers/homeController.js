import { Router } from 'express';
import Laptop from '../models/Laptop.js';
import laptopService from '../services/laptopService.js';
import { getErrorMessage } from '../utilis/errorUtilis.js';
import { isAuth } from '../middlewares/authMiddleware.js';

let router = Router();

router.get('/', async (req, res) => {
    try {
        let laptop = await laptopService.getLatestLaptop();
        res.render('home', { laptop });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('404', { error });
    }
});

router.get('/profile', isAuth, async (req, res) => {
    let createdLaptop = await laptopService.getProfile({ creator: req.user.id });
    let preferredLaptop = await laptopService.getProfile({ prefer: req.user.id });
    res.render('profile', { createdLaptop, preferredLaptop });
});

router.get('/about', (req, res) => {
    res.render('about');
});

export default router;