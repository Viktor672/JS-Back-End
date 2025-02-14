import { Router } from 'express';
import authService from '../services/authService.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';

let router = Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    let userData = req.body;

    try {
        let token = await authService.register(userData);

        res.cookie('auth', token, { httpOnly: true, secure: false });
        res.redirect('/');
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('register', { userData, error });
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let token = await authService.login(email, password);

        res.cookie('auth', token, { httpOnly: true, secure: false });
        res.redirect('/');
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('login', { userData: req.body, error });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth');

    res.redirect('/');
});

export default router;