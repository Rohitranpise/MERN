const User = require("../models/user.model")

const registerUser = async (req, res) => {
    try {
        const { name, email, password, pic } = req.body;
        if (!name || !email || !password) {
            res.status(400)
            throw new Error("Enter all the fields")
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400)
            throw new Error(`user already exists`)
        }

        const user = await User.create({
            name,
            email,
            password,
            pic
        })

        if (user) {
            res.status(201)
                .json({
                    _id: user._id,
                    name: user.email,
                    password: user.password,
                    pic: user.pic,
                })
        } else {
            res.status(400)
            throw new Error(`failed to create new user`)
        }

    } catch (error) {
        res.status(500).send(`error doing registration`)
    }
}


module.exports = {
    registerUser,
}