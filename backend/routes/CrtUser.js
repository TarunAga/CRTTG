const express = require('express');

const router = express.Router()

const Student = require('../models/Student');

const Faculty = require('../models/Faculty');

const Admin = require('../models/Admin');

const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const jwtSecret = "ISDLproject";

const generateRandomString = (myLength) => {
    const chars =
        "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
        { length: myLength },
        (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );

    const randomString = randomArray.join("");
    return randomString;
};

router.post('/createuser', [

    body('email').isEmail()

],
    async (req, res) => {

        let myPassword = generateRandomString(10);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(myPassword, salt);

        try {

            let myUserType = req.body.usertype;
            if (myUserType === 'Faculty') {
                let checkIt = await Faculty.findOne({ email: req.body.email });

                if (checkIt) {
                    return res.status(400).json({ errors: 'You are already a user.' });
                }

                await Faculty.create({
                    email: req.body.email,
                    password: secPass,
                    name:req.body.email.split('@')[0]
                })

                let userData = await Faculty.findOne({ email: req.body.email });

                const newData = {
                    Faculty: {
                        id: userData._id,
                        usertype: 'Faculty'
                    }
                }

                const newAuthToken = jwt.sign(newData, jwtSecret);
                console.log(req.body.email+" --> "+myPassword);

                res.json({ success: true, authToken: newAuthToken, Id: userData._id });
            }
            else if(myUserType === 'Student'){

                let checkIt = await Student.findOne({ email: req.body.email });

                if (checkIt) {
                    return res.status(400).json({ errors: 'You are already a user.' });
                }

                await Student.create({
                    email: req.body.email,
                    password: secPass,
                    name:req.body.email.split('@')[0],
                    year:"TBD",
                    batch:"TBD",
                    cgpa:"TBD"
                })

                let userData = await Student.findOne({ email: req.body.email });

                const newData = {
                    Student: {
                        id: userData._id,
                        usertype: 'Student'
                    }
                }

                const newAuthToken = jwt.sign(newData, jwtSecret);
                console.log(req.body.email+" --> "+myPassword);

                res.json({ success: true, authToken: newAuthToken, Id: userData._id });
            }
            else{
                let checkIt = await Admin.findOne({ email: req.body.email });

                if (checkIt) {
                    return res.status(400).json({ errors: 'You are already a user.' });
                }

                await Admin.create({
                    email: req.body.email,
                    password: secPass,
                    name:req.body.email.split('@')[0]
                })
                let userData = await Admin.findOne({ email: req.body.email });

                const newData = {
                    Admin: {
                        id: userData._id,
                        usertype: 'Admin'
                    }
                }

                const newAuthToken = jwt.sign(newData, jwtSecret);
                console.log(req.body.email+" --> "+myPassword);

                res.json({ success: true, authToken: newAuthToken, Id: userData._id });
            }
        }
        catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })


router.post('/loginuser', async (req, res) => {

    try {
        let myut = req.body.usertype.UserType;

        // console.log(req.body.usertype.UserType);
        // console.log(req.body.email);
        // console.log(req.body.password);

        if(myut === 'Faculty'){
            let userData = await Faculty.findOne({ email: req.body.email });

            if (!userData) {
                return res.status(400).json({ errors: 'Try logging with correct credentials' });
            }

            const passwordCmp = await bcrypt.compare(req.body.password, userData.password);

            if (!passwordCmp) {
                return res.status(400).json({ errors: 'Try logging with correct credentials' });
            }

            const data = {
                id: userData._id,
                usertype: 'Faculty'
            }

            const authToken = jwt.sign(data, jwtSecret)

            res.json({ success: true, authToken: authToken});
        }

        else if(myut === 'Student'){
            let userData = await Student.findOne({ email: req.body.email });

            if (!userData) {
                return res.status(400).json({ errors: 'Try logging with correct credentials' });
            }

            const passwordCmp = await bcrypt.compare(req.body.password, userData.password);

            if (!passwordCmp) {
                return res.status(400).json({ errors: 'Try logging with correct credentials' });
            }

            const data = {
                id: userData._id,
                usertype: 'Student'
            }

            const authToken = jwt.sign(data, jwtSecret)

            res.json({ success: true, authToken: authToken});
        }

        else{
            let userData = await Admin.findOne({ email: req.body.email });

            if (!userData) {
                return res.status(400).json({ errors: 'Try logging with correct credentials' });
            }

            const passwordCmp = await bcrypt.compare(req.body.password, userData.password);

            if (!passwordCmp) {
                return res.status(400).json({ errors: 'Try logging with correct credentials' });
            }

            const data = {
                id: userData._id,
                usertype: 'Admin'
            }

            const authToken = jwt.sign(data, jwtSecret)

            res.json({ success: true, authToken: authToken});
        }
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

router.post('/extractUserType', [], async (req, res) => {
    const token = req.body.authToken;

    try {
        const decoded = jwt.verify(token, jwtSecret);
        return res.json({ success: true, usertype : decoded.usertype });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

module.exports = router; 