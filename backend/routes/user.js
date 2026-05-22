const { Router } = require("express");
const User = require('../models/user');
const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.matchPassword(email, password);
        return res.redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password"
        });
    }
});

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        await User.create({
            fullName,
            email,
            password,
        });
        return res.redirect("/");
    } catch (error) {
        console.error("Signup Error:", error.message);
        return res.render("signup", {
            error: "Email already registered or invalid details."
        });
    }
});

module.exports = router;

