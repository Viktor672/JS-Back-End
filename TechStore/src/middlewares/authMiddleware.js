import jwt from 'jsonwebtoken';

let SECRET = 'SOMESECRET';

export let authMiddleware = (req, res, next) => {
    let token = req.cookies['auth'];

    if (!token) {
        return next();
    }

    try {
        let decodedToken = jwt.verify(token, SECRET);
        req.user = decodedToken;
        res.locals.user = decodedToken;

        next();
    }
    catch (err) {
        res.setError('Invalid Authentication!');
        res.clearCookie('auth');
        res.redirect('/login');
    }

}

export let isAuth = (req, res, next) => {
    if (!req.user) {
        res.setError('You must be logged in to be able to do that!');
        return res.redirect('/login');
    }

    next();
}