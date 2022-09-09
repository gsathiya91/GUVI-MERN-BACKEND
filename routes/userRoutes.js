const router = require('express').Router();
const User = require('../models/userSchema');
const Profile = require('../models/profileSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { userName, email, password, confirmPassword } = req.body;
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json("Email already exists!");
        }
        if (password === confirmPassword) {
            const user = new User({
                userName,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            return res.status(200).json("Registered Successfully");

        }
        if (password != confirmPassword) {
            return res.status(400).json("Password does not match!");
        }
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existedEmail = await User.findOne({ email });
        if (!existedEmail) {
            return res.status(400).json("Email does not exists !");
        }

        const validatePassword = await bcrypt.compare(password, existedEmail.password);
        if (!validatePassword) {
            return res.status(400).json("Password Error !");
        }

        const token = await jwt.sign({ email: existedEmail.email }, process.env.JWT_SECRET_KEY, { expiresIn: "3 days" });
        res.header('accessToken', token).json(token);

    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/profile', async (req, res) => {
    const { number, dateOfBirth, gender, age } = req.body;
    try {
        const profile = new Profile({ number, dateOfBirth, gender, age });
        await profile.save();
        return res.status(200).json("Profile updated successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;