const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        // We assume authMiddleware has already run
        const user = await User.findById(req.user.id);
        if (user && user.isAdmin) {
            next();
        } else {
            res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
};