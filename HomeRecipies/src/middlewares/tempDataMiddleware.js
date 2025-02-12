export let tempData = (req,res, next) => {
    res.setError = (message) => {
        req.session.error = {
            message,
            isFirstRequst:true
        }
    }

    if(!req.session.error){
        return next();
    }

    if(!req.session.error.isFirstRequst){
delete req.session.error; 
    }

    req.session.error.isFirstRequst = false;
    res.locals.error = req.session.error.message;

    next()
}