//All authentication related end points
const express = require("express");
const router = express.Router();

const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser")
const JWT_SECRET = "Iamagoodb$oy";//Better to not hard code but use env local file

// ROUTE 1: Create a User using POST"/api/auth/createUser". Doesnot require auth
router.post('/createuser',
    [
        body('name').isLength({ min: 3 }),
        body('email').isEmail(),
        body('password', 'Must be atleast 5 characters').isLength({ min: 5 })
    ],
    async (req, res) => {
        //If there are errors in inputs, return bad request and errors 
        const errors = validationResult(req);
        let success = false;
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, error: errors.array() });
        }
        //Check whether user with this email exists already
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, error: "User with this email id already exists" })
            }
            

            //all vaidations passed, so create new user object in db
            // Encrypt and salt
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email,
            })
            //Now authentication token needs to sent in response to user to assure particular user is logged in
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);//sync method returns paylod
            success = true;
            res.json({ success, authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server error");
        }
    });

// ROUTE 2: Authenticate a User using POST"/api/auth/login". No login required
router.post('/login',
    [
        body('email').isEmail(),
        body('password', 'Password cannot be blank')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        let success = false;
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email: email });

            if (!user) {//user with such mail not found

                return res.status(400).json({ success, "error": "Incorrect Credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);

            if (!passwordCompare) {//password incorrect
                return res.status(400).json({ success, error: "Incorrect Credentials" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }

            const authToken = jwt.sign(data, JWT_SECRET);//sync method returns paylod
            success = true;
            res.json({ success, authToken });
        } catch (error) {
            // console.error(error.message);
            res.status(500).send("Internal Server error");
        }
    }
)

// ROUTE 3: Get loggedIn User Details using POST"api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router;
