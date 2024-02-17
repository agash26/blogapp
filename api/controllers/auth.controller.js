import User from "../models/user.model.js";
import brcypt from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import Jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }

    const hashPassword = brcypt.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashPassword
    });

    try {
        await newUser.save();
        res.json({ message: 'Sign Up Successful' })
    } catch (err) {
        next(err);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(errorHandler(400, 'Email/Password is empty'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(400, 'User not found'));
        }
        const validPassword = brcypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Password is invalid'));
        }

        const token = Jwt.sign(
            { userId: validUser._id },
            process.env.JWT_SECRET_KEY
        );
        const {password: pass, ...rest} = validUser._doc;
        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(rest);
    } catch (err) {
        next(err);
    }
}