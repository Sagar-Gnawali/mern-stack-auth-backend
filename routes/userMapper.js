const route = require('express').Router();
const userModel = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requireLogin } = require('../middleware/authMiddleware.js');

route.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exist' });
        }
        const hashed_password = await bcrypt.hash(password, 10);
        user = new userModel({
            name,
            email,
            password: hashed_password
        });
        await user.save();
        return res.status(201).json({
            message: 'user created successfully'
        })

    } catch (error) {
        console.log('error while createing user is ', error);
    }
});

route.post('/login', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        let isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } catch (error) {
        console.log('error while login is ', error);
    }
});

route.get('/', requireLogin, async (req, res) => {
    console.log(req.user);
    try {
        const user = await userModel.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.log('something went wrong in check');   
    }
})
module.exports = route;