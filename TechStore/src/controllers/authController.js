import { Router } from 'express';
import authService from '../services/authService.js';
import { getErrorMessage } from '../utilis/errorUtilis.js';
import { isAuth } from '../middlewares/authMiddleware.js';

let router = Router();

export default router;

router.get('/register', (req, res) => {
    res.render('auth/register');
});


router.post('/register', async (req, res) => {
    let userData = req.body;

    try {
        let token = await authService.register(userData);

        res.cookie('auth', token, { expiresIn: '3h' });
        res.redirect('/');
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('auth/register', { user: userData, error });
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

        res.render('auth/login', {user:req.body, error });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth');

    res.redirect('/');
});