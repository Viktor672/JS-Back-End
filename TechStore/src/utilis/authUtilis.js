import jwt from 'jsonwebtoken';

let SECRET = 'SOMESECRET';

export let generateToken = (user) => {
    let payload = {
        id: user.id,
        name: user.name,
        email: user.email
    }

    let token = jwt.sign(payload, SECRET, { expiresIn: '3h' });

    return token;
}