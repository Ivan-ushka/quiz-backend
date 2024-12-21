require('dotenv').config()

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');

const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(cookieParser())
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

start()

module.exports = app
