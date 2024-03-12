const express = require('express');
const mongoose = require('mongoose'); 
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const jwtSecret = "ISDLproject";

router.post('/getFacultyData', [], async (req, res) => {
    const token = req.body.authToken;

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const myFacultyData = await Faculty.findById(decoded.id).populate('Courses').exec();
        return res.json({ success: true, data: myFacultyData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
});

router.post('/getFacultyList', async (req, res) => {
    try {
        const orderedFacultyList = await Faculty.find({}, null, { sort: { email: 1 } }).exec();
        // console.log(orderedFacultyList);
        return res.json({ success: true, data: orderedFacultyList });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// router.get('/tarunhehe', async (req, res) => {
//     try {
//         const fac = await Student.find({});

//         for (const f of fac) {
//             let lol = f.email;
//             f.email = lol.toLowerCase();
//             f.save();
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

module.exports = router;
