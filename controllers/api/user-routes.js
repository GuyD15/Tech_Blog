const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');

// User registration route
router.post('/signup', async (req, res) => {
    // Check if password and confirmPassword match
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match!' });
    }

    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// User login route
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { username: req.body.username } });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
            return;
        }

        const validPassword = userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            // Redirect to dashboard after successful login
            res.redirect('/dashboard');
        });
    } catch (err) {
        res.status(400).json(err);
    }
});


// User logout route
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
