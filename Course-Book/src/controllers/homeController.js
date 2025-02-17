import { Router } from 'express';
import { User } from '../models/User.js';
import bookService from '../services/bookService.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';

let router = Router();

router.get('/', async (req, res) => {
    try {
        let book = await bookService.getLatestBook();

        res.render('home', { book });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('home', { error });
    }
});

router.get('/catalog', async (req, res) => {
    try {
        let book = await bookService.getLatestBook();
        
        res.render('catalog', { book });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('catalog', { book, error });
    }
});

router.get('/profile', isAuth, async (req, res) => {
    let userId = req.user?.id;
    let createdBook = await bookService.getProfile({ owner: userId });
    let signedUpBook = await bookService.getProfile({ signUp: userId });

    let booksCount = createdBook.length;
    let signUpCount = signedUpBook.length;
    let userData = await User.findById(userId);

    res.render('profile', { book: createdBook,userData, signedUpBook, booksCount, signUpCount });
});

export default router;