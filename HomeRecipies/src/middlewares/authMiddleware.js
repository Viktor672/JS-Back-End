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
        res.clearCookie('auth');
        let error = 'Authentication failed!';

        res.render('404', { error });
    }
}

export let isAuth = (req, res, next) => {
    if (!req.user) {
        let error = 'You must be logged in to be able to do that!';
        res.render('404', { error });
    }

    next();
}