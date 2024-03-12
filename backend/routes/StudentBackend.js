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

router.post('/getStudentData', [], async (req, res) => {
    const token = req.body.authToken;

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const myStu = await Student.findById(decoded.id).populate('Courses').exec();
        return res.json({ success: true, data: myStu });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

module.exports = router;
