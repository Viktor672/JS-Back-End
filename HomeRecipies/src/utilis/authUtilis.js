import jwt from 'jsonwebtoken';

let SECRET = 'SOMESECRET';

export let generateToken = (userData) => {
    let payload = {
        id: userData.id,
        username: userData.username,
        email: userData.email
    }

    let token = jwt.sign(payload, SECRET, { expiresIn: '3h' });

    return token;
}