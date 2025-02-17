import jwt from 'jsonwebtoken';

let SECRET = 'SOMESECRET';

export let generateToken = (userData) => {
    let payLoad = {
        id: userData.id,
        username: userData.username,
        email: userData.email
    }

    let token = jwt.sign(payLoad, SECRET, { expiresIn: '2h', audience: 'TheAppUsers' });

    return token;
}