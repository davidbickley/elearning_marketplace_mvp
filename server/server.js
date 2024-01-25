import express from 'express';
import cors from 'cors';
import { readdirSync } from 'fs';
import mongoose from 'mongoose';
import csrf from 'csurf';
import cookieParser from 'cookie-parser'
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const csrfProtection = csrf({
    cookie: true,
    value: (req) => req.headers['x-csrf-token'],
});

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// CSRF
app.use(csrfProtection)

app.use((error, req, res, next) => {
    if (error.code === 'EBADCSRFTOKEN') {
        // CSRF token errors handling
        res.status(403);
        res.send('CSRF token error');
    } else {
        // handle other errors
        next(error);
    }
});


// Routes
const routeFiles = readdirSync('./routes');
for (const routeFile of routeFiles) {
    import(`./routes/${routeFile}`).then((routeModule) => {
        app.use('/api', routeModule.default);
    });
}

app.get('/api/csrf-token', csrfProtection, function (req, res) {
    res.json({ csrfToken: req.csrfToken() });
});

// Set Port
const port = process.env.PORT || 8000;

// Start Server
app.listen(port, () => console.log(`Server is running on port: ${port}`));
