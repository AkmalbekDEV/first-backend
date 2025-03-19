require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const postRoute = require('./routes/post.route');
const authRoute = require('./routes/auth.route');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Libraries
app.use(express.json());
app.use(cookieParser({}));
app.use(fileUpload({}));
app.use(express.static('static'));

// Routes
app.use('/api', postRoute);
app.use('/api', authRoute);

// Errors
app.use(errorMiddleware);

const DB_URL = process.env.DB_URL;
const PORT = 8080;

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_URL).then(() => console.log("Connected DB"));
        app.listen(PORT, () => console.log(`Listening on - http://localhost:${PORT}`));
    } catch (error) {
        console.error("Error connecting with DB:", error);
    };
};

bootstrap();