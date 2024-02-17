import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

mongoose
    .connect(process.env.MONG_URL)
    .then(console.log('mongo db connected'))
    .catch((err) => {
        console.error(err);
    })

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);