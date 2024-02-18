import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import brcypt from 'bcryptjs';

export const test = (req, res) => {
    res.json({ message: 'api works' });
};

export const updateUser = async (req, res, next) => {
    if (req.user.userId !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'))
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be atleast 6 characters'))
        }

        req.body.password = brcypt.hashSync(req.body.password, 10);
        if (req.body.username) {
            if (req.body.username.length < 7 || req.body.username.length > 20) {
                return next(errorHandler(400, 'Username must be between 7 to 20 characters'))
            }
            if (req.body.username.includes(' ')) {
                return next(errorHandler(400, 'Username contains space'));
            }
        }
        try {
            const updatedUser = await User.findOneAndUpdate({_id: req.params.userId}, {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }, {new: true});
            const { password, ...rest } = updatedUser._doc
            res.status(200).json(rest);
        } catch (err) {
            next(err);
        }
    }
}