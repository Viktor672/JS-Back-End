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
        res.redirect('/auth/login');
    }

}

export let isAuth = (req, res, next) => {
    if (Object.keys(req.user).length <= 0) {
        return res.redirect('/auth/login');
    }

    next();
}