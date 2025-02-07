export let getErrorMessage = (err) => {
    if (err.name === 'ValidationError') {
        return Object.values(err.errors)[0].message;
        //err.errors.email.message
    }
    else {
        return err.message;
    }
}