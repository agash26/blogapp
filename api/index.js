import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
dotenv.config();
mongoose
    .connect(process.env.MONG_URL)
    .then(console.log('mongo db connected'))
    .catch((err) => {
        console.error(err);
    })

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});

