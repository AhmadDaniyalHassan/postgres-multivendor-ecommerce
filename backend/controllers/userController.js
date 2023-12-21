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

const editUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, email, password, address, phoneNumber } = req.body;

        // Find the user by ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Update user fields
        user.username = username || user.username;
        user.email = email || user.email;
        if (password) {
            const hashedPassword = await hashPassword(password);
            user.password = hashedPassword;
        }
        user.address = address || user.address;
        user.phoneNumber = phoneNumber || user.phoneNumber;

        // Save the updated user
        await user.save();

        res.status(200).send({ message: "User updated successfully", user: user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user by ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Delete the user
        await user.destroy();

        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
module.exports = { createUser, loginUser, getUser, editUser, deleteUser };
