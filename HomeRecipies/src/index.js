import express from 'express';
import handlebars from 'express-handlebars';
import routes from './routes.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { tempData } from './middlewares/tempDataMiddleware.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import expressSession from 'express-session';

let app = express();

try {
    let uri = 'mongodb://127.0.0.1:27017/homeRecipes';
    await mongoose.connect(uri);
}
catch (err) {
    throw new Error(err.message);
}

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        setTitle(title) {
            this.pageTitle = title;
        }
    }
}));

app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use('/static', express.static('src/static'));
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
    secret: 'SECRET',
    resave: false, // controls whether a session is saved back to the session store on every request, even if it hasn't been modified.
    saveUninitialized: false,  //whether an empty session to be saved in the session store
    cookie: {
        secure: false,  //it can be sent to both http and https
        httpOnly: true //wheter it can be accessed by js
    }
}));
app.use(cookieParser());
app.use(tempData);
app.use(authMiddleware);
app.use(routes);


app.listen(3000, () => console.log('Server is listening on port 3000...'));