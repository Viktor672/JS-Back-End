import { Router } from 'express';
import movieService from '../services/movieService.js';
import castService from '../services/castService.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { getErrorMessage } from '../utilis/errorUtilis.js';

let router = Router();

router.get('/create', isAuth, async (req, res) => {
    let categories = getCategoriesData();
    res.render('create', { movieObj: {}, categories });
});


router.post('/create', isAuth, async (req, res) => {
    let newMovieObj = req.body;
    let userId = req.user?.id;

    try {
        await movieService.create(newMovieObj, userId);
        res.redirect('/');
    }
    catch (err) {
        let categories = getCategoriesData(newMovieObj.category);

        let error = getErrorMessage(err);

        res.render('create', { movieObj: newMovieObj, categories, error });
    }

});

router.get('/:id/details', async (req, res) => {
    let id = req.params.id;
    try {
        let movieObj = await movieService.getOne(id);
        let isCreator = movieObj.creator?.equals(req.user?.id);
        res.render('movie/details', { movieObj, isCreator });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('movie/details', { error });
    }
});

router.get('/search', async (req, res) => {
    let query = req.query;
    try {
        let filteredMovieArr = await movieService.getAll(query);

        res.render('search', { filteredMovieArr, query });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('search', { error });
    }
});

router.get('/:id/attach-cast', isAuth, async (req, res) => {
    let id = req.params.id;
    try {
        let movie = await movieService.getOne(id);
        let casts = await castService.getAll({ exclude: movie.casts });

        res.render('movie/attachCast', { movie, casts });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('movie/attachCast', { error });
    }
});

router.post('/:id/attach-cast', isAuth, async (req, res) => {
    let castId = req.body.cast;
    let movieId = req.params.id;
    try {
        await movieService.attachCast(movieId, castId);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('movie/attachCast', { error });
    }
    res.redirect(`/movies/${movieId}/details`);
});

router.get('/:id/delete', isAuth, async (req, res) => {
    let id = req.params.id;
    let movie = await movieService.getOne(id);

    if (!movie.creator?.equals(req.user?.id)) {
        res.setError('You should be the movie owner!');
        return res.redirect('/404');
    }
    try {
        await movieService.delete(id);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('404', { error });
    }
    res.redirect('/');
});

function getCategoriesData(category) {
    let categoriesData = {
        'tv-show': 'TV Show',
        animation: 'Animation',
        movie: 'Movie',
        documentary: 'Documentary',
        'short-film': 'Short Film'
    }

    let categories = Object.keys(categoriesData).map(key => ({
        value: key,
        label: categoriesData[key],
        selected: key === category ? 'selected' : ''
    }));

    return categories;
}

router.get('/:id/edit', isAuth, async (req, res) => {
    let id = req.params.id;
    try {
        let movieObj = await movieService.getOne(id);
        let categories = getCategoriesData(movieObj.category);

       return res.render('movie/edit', { movieObj, categories });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('movie/edit', { movieObj, error });
    }
});

router.post('/:id/edit', isAuth, async (req, res) => {
    let movieData = req.body;
    let id = req.params.id;
    try {
        let movie = await movieService.getOne(id);
        let error = 'You should be creator in able to edit!';

        if (!movie.creator) {
           return res.render('edit', { movieData: movie, error });
        }

        await movieService.update(id, movieData);
    }
    catch (err) {
        let error = getErrorMessage(err);
        let categories = getCategoriesData(movieData.category);
        return res.render('movie/edit', { movieObj: movieData, categories, error });
    }
    res.redirect(`/movies/${id}/details`);
});

export default router;