export let sessionErrorHandler = (req, res, next) => {
    res.setError = (msg) => {
        req.session.error = {
            msg,
            isFirstRequest: true
        }
    }

    if (!req.session.error) return next();

    if (!req.session.error.isFirstRequest) {
        delete req.session.error;
    }

    req.session.error.isFirstRequest = false;
    res.locals.error = req.session.error.message;

    next();
}