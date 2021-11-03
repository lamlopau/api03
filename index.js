require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const authRouter = require('./route/auth')
const postRouter = require('./route/post')
const classRouter = require('./route/class')
const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@reset.hlqx0.mongodb.net/reset?retryWrites=true&w=majority`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log(`MongoDB connect`)
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
connectDB()
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/class', classRouter);

const port = 2222;

app.listen(port, () => console.log(`sv dang chay tren port ${port}`))