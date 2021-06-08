const jwt = require('jsonwebtoken');
exports.requireLogin = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            // Verify token
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // Attach token to the user
            req.user = decode;
            next();
        }
        else {
            return res.status(400).json({ message: 'unauthorized' });
        }
    } catch (error) {
        console.log('Something went wrong from authmiddleware');
    }
}