require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

const newToken = (user) => {
    return jwt.sign({ user }, `${process.env.JWT_SECRET_KEY}`);
};

const registerUser = async (req, res) => {

    try {
        const { name, email, password, pic } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ message: "Please Enter all the Fields" });
        }

        let user = await User.findOne({ email });

        if (user) return res.status(400).send({ message: "Please try another email" });

        user = await User.create({
            name,
            email,
            password,
            pic,
        });

        var token = newToken(user);

        return res.send({ user, token })

    } catch (error) {
        res.status(500).send(error.message)
    }

};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res
                .status(400)
                .send({ message: "Please try another email or password" });

        const match = user.checkPassword(req.body.password);

        if (!match)
            return res
                .status(400)
                .send({ message: "Please try another email or password" });

        const token = newToken(user);

        return res.send({ user, token });

    } catch (error) {
        return res.status(500).send(err.message);
    }
};

module.exports = { registerUser, loginUser, };