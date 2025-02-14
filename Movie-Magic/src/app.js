import express from 'express';
import handlebars from 'express-handlebars';
import showRating from './helpers/ratingHelper.js';
import routes from './routes.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import { tempData } from './middlewares/tempDataMiddleware.js';
import { authMiddleware } from './middlewares/authMiddleware.js';


let app = express();

try {
    let uri = 'mongodb://127.0.0.1:27017/magic-movies';
    await mongoose.connect(uri);
}
catch (err) {
    console.log(err.message);
}

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    helpers: {
        showRating
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
}));

app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use('/static', express.static('src/static'));
app.use(express.urlencoded({ extended: false })); //so that express can parse parse from data
app.use(expressSession({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httponly: true
    }
}));
app.use(cookieParser());
app.use(tempData);
app.use(authMiddleware);
app.use(routes);

app.listen(5000, () => console.log('Server is listening on http://localhost:5000...'));