const User = require("../models/user.model")
const generateToken = require("../db/generateToken")
const bcrypt = require("bcryptjs")

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

        //hashing the password..

        const hash = await bcrypt.hash(password, 12)

        const user = await User.create({
            name,
            email,
            password: hash,
            pic,
        })

        if (user) {
            res.status(201)
                .json({
                    _id: user._id,
                    name: user.email,
                    password: user.password,
                    pic: user.pic,
                    token: generateToken(user._id)
                })
        } else {
            res.status(400)
            throw new Error(`failed to create new user`)
        }

    } catch (error) {
        res.status(500).send(`error doing registration`)
    }
}



//user SignIN

const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password)

            if (passwordMatch) {
                const token = generateToken(user._id)
                res.status(200).json({ token: token, user: user });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).send(`error doing signin`)
    }
}


module.exports = {
    registerUser,
    authUser,
}