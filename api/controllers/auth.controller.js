import User from "../models/user.model.js";
import brcypt from 'bcryptjs';

export const signup = async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
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
        res.status(500).json({ message: err.message });
    }
}