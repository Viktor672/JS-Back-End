import { Router } from 'express';
import authService from '../services/authService.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { getErrorMessage } from '../utilis/errorUtilis.js';

let router = Router();

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    let userData = req.body;
    try {
        await authService.register(userData);
        res.redirect('/auth/login');
    }
    catch (err) {
        let error = getErrorMessage(err);

        return res.render('auth/register', { error });
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let token = await authService.login(email, password);

        res.cookie('auth', token, { httpOnly: true });
        res.redirect('/');
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('auth/login', { error });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth');

    res.redirect('/');
});

export default router;  