const User = require('../models/user');
const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helper/passwordHelper');


const createUser = async (req, res) => {
    try {
        const { username, email, password, address, phoneNumber } = req.body;
        const hashedPassword = await hashPassword(password);
        const user = new User({ username, email, password: hashedPassword, address, phoneNumber });
        await user.save()
        res.status(201).send({ message: "User created successfully", user: user })
        console.log(user)
        console.log(hashedPassword)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "User not found" })
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send({ message: "Invalid password" })

        }

        const token = JWT.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: "Login successful", token, user: user })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}


const getUser = async (req, res) => {
    try {
        const user = await User.findAll()
        res.status(200).send({ message: "User fetched successfully", user: user })
        console.log(user)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

module.exports = { createUser, loginUser, getUser };
