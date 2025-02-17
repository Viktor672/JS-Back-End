import { Router } from 'express';
import { User } from '../models/User.js';
import bookService from '../services/bookService.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';
import { isAuth } from '../middlewares/authMiddleware.js';

let router = Router();

router.get('/create', isAuth, (req, res) => {
    res.render('create');
});

router.post('/create', isAuth, async (req, res) => {
    let bookData = req.body;
    let userId = req.user?.id;

    try {
        await bookService.create(bookData, userId);
        res.redirect('/catalog');
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('create', { bookData, error });
    }
});

router.get('/:id/details', async (req, res) => {
    let id = req.params.id;

    try {
        let bookData = await bookService.getOne(id);
        let userId = req.user?.id;
        let userData = await User.findById(userId);
        let isOwner = bookData.owner?.equals(req.user?.id);
        let hasSignedUp = Array.isArray(bookData.signUpList) && bookData.signUpList.includes(userId);
        let signUpCount = bookData.signUpList.length;
        let hasUsersSignedUp = signUpCount > 0;

        let usernames = [];

        if (hasUsersSignedUp) {
            let users = await User.find({ _id: { $in: bookData.signUpList } });
            usernames = users.map(user => user.username).join(', ');
        }
        
        res.render('details', { bookData, userData, isOwner,hasSignedUp, usernames, hasUsersSignedUp });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }
});

router.get('/:id/delete', isAuth, async (req, res) => {
    let id = req.params.id;
    try {
        await bookService.deleteData(id);

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
        let bookData = await bookService.getOne(id);

        res.render('edit', { bookData });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('edit', { bookData, error });
    }
});

router.post('/:id/edit', isAuth, async (req, res) => {
    let id = req.params.id;
    let bookData = await req.body;

    try {
        let book = await bookService.getOne(id);

        if (!book.owner?.equals(req.user?.id)) {
            let userError = 'You should be the creator in order to do that!';

            res.render('edit', { bookData, userError });
        }

        await bookService.updateData(id, bookData);
        res.redirect(`/${id}/details`);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('edit', { bookData, error });
    }
});

router.get('/search', async (req, res) => {
    let query = req.query;

    try {
        let book = await bookService.getAll(query);

        res.render('search', { book, query });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('search', { query, error });
    }
});

router.get('/:id/signUp', isAuth, async (req, res) => {
    let bookId = req.params.id;
    let userId = req.user?.id;

    try {
        await bookService.signUp(bookId, userId);
        res.redirect(`/${bookId}/details`);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }

});



export default router;