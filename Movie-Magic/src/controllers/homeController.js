import { Router } from 'express';
import Movie from '../models/Movie.js';
import { getErrorMessage } from '../utilis/errorUtilis.js';

let router = Router();

router.get('/', async (req, res) => {
    try {
        let movieArr = await Movie.find({});
        res.render('home', { movieArr });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('/', { movieArr, error });
    }
});

router.get('/about', (req, res) => {
    res.render('about');
});

export default router;