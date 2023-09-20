require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

const verifyToken = (token) => {
    console.log('token:verifyToken', token)
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            console.log('err:', err)
            if (err) return reject(err);

            resolve(user);
        });
    });
};

module.exports = async (req, res, next) => {
    let user;
    try {
        console.log('req.headers.authorization:', req.headers.authorization)
        if (!req.headers.authorization)
            return res.status(400).send({
                message: "authorization token was not provided or was not valid",
            });
        if (!req.headers.authorization.startsWith("Bearer "))
            return res.status(400).send({
                message: "authorization token was not provided or was not valid",
            });

        const token = req.headers.authorization.split(" ")[1];


        user = await verifyToken(token);
    } catch (err) {
        return res.status(400).send({
            message: "authorization token was not provided or was not valid3",
        });
    }

    console.log('user:', user)
    req.user = await User.findById(user.user._id).select("-password");
    console.log('req.user:', req.user)

    return next();
};