const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const jwtSecret = "ISDLproject";

router.post('/getStudentsOfCourse', [], async (req, res) => {
    let final = '"Name","Email","Batch"\n';
    const data = await Course.findById(req.body.cId).populate('Students').exec();

    data.Students.forEach(stu => {
            final += `"${stu.name}","${stu.email}","${stu.batch}"\n`;
    });
    try {
        fs.writeFileSync('studentdata.csv', final);
        fs.readFile('studentdata.csv', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading output file:', err);
                res.status(500).send('Error reading output file');
                return;
            }

            // Send the output file content in the response
            res.set('Content-Disposition', 'attachment; filename=studentdata.csv');
            res.set('Content-Type', 'text/csv');
            res.send(data);

            fs.unlink('studentdata.csv', (err) => {
                if (err) {
                    console.error('Error deleting output file:', err);
                }
            });
        });
    } catch (err) {
        console.error('Error writing file:', err);
        res.status(500).send('Error writing file');
    }
});
router.post(
    '/createcourse',
    [
        body('courseId').notEmpty().withMessage('Course ID is required'),
        body('name').notEmpty().withMessage('Name is required'),
        body('batch').notEmpty().withMessage('Batch is required'),
        body('seats').notEmpty().withMessage('Number of Seats is required'),
        body('credits').notEmpty().withMessage('Credits is required')
    ],
    async (req, res) => {
        // console.log(req.body);
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const newCourse = new Course({
                courseId: req.body.courseId,
                name: req.body.name,
                batch: req.body.batch,
                credits: req.body.credits,
                seats: req.body.seats,
                Faculty: req.body.Faculty,
                Students: [],
                courseType: req.body.courseType
            });

            const createdCourse = await newCourse.save();

            try {
                for (const facultyId of req.body.Faculty) {
                    const myfac = await Faculty.findById(facultyId);
                    await myfac.addCourse(createdCourse._id);
                    // console.log(myfac);
                }
            } catch (error) {
                console.error(error);
            }

            return res.json({ success: true, courseRId: createdCourse._id });
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
    }
);

router.post(
    '/updatecourse',
    [
        body('courseRId').notEmpty().withMessage('Course RID is required'),
        body('courseId').notEmpty().withMessage('Course ID is required'),
        body('name').notEmpty().withMessage('Name is required'),
        body('batch').notEmpty().withMessage('Batch is required'),
        body('seats').notEmpty().withMessage('Number of Seats is required'),
        body('credits').notEmpty().withMessage('Credits is required')
    ],
    async (req, res) => {
        // console.log(req.body);
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const mycourse = await Course.findById(req.body.courseRId);
            try {
                for (const facultyId of mycourse.Faculty) {
                    const myfac = await Faculty.findById(facultyId);
                    await myfac.removeCourse(mycourse._id);
                }
            } catch (error) {
                console.error(error);
            }
            await mycourse.update({
                courseId: req.body.courseId,
                name: req.body.name,
                batch: req.body.batch,
                credits: req.body.credits,
                seats: req.body.seats,
                courseType: req.body.courseType,
                Faculty: req.body.Faculty
            });
            try {
                for (const facultyId of req.body.Faculty) {
                    const myfac = await Faculty.findById(facultyId);
                    await myfac.addCourse(mycourse._id);
                    // console.log(myfac);
                }
            } catch (error) {
                console.error(error);
            }
            return res.json({ success: true });
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
    }
);

router.post(
    '/delcourse',
    [
        body('courseRId').notEmpty().withMessage('Course RID is required'),
    ],
    async (req, res) => {
        // console.log(req.body);
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const mycourse = await Course.findById(req.body.courseRId);
            try {
                for (const facultyId of mycourse.Faculty) {
                    const myfac = await Faculty.findById(facultyId);
                    await myfac.removeCourse(mycourse._id);
                }
            } catch (error) {
                console.error(error);
            }
            try {
                for (const studentId of mycourse.Students) {
                    const mystu = await Faculty.findById(studentId);
                    await mystu.removeCourse(mycourse._id);
                }
            } catch (error) {
                console.error(error);
            }
            return res.json({ success: true });
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
    }
);
router.post(
    '/regcourse',
    [
    ],
    async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const decoded = jwt.verify(req.body.authToken, jwtSecret);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const mycourse = await Course.findById(req.body.courseRId).session(session);
            const mystudent = await Student.findById(decoded.id).session(session);

            if (!mycourse || !mystudent) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Course or student not found' });
            }

            if (mycourse.courseType !== "Program Course") {
                let sc = parseInt(mycourse.seats);
                let sa = mycourse.Students.length;
                if (sc === sa) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.json({ success: false });
                }
            }

            await mycourse.addStudent(mystudent._id);
            await mystudent.addCourse(mycourse._id);

            await session.commitTransaction();
            session.endSession();

            return res.json({ success: true });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            console.error('Error adding student:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
);
router.post(
    '/dropcourse',
    [
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const decoded = jwt.verify(req.body.authToken, jwtSecret);
            const mycourse = await Course.findById(req.body.courseRId);
            const mystudent = await Student.findById(decoded.id);

            if (!mycourse || !mystudent) {
                return res.status(404).json({ message: 'Course or student not found' });
            }

            await mycourse.removeStudent(mystudent._id);
            await mystudent.removeCourse(mycourse._id);
            return res.json({ success: true });
        }
        catch (error) {
            console.error('Error adding student:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
);

router.post('/getCourseData', [], async (req, res) => {
    try {
        const myCourseData = await Course.findById(req.body.id).populate('Faculty').exec();
        return res.json({ success: true, data: myCourseData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
});

router.post('/getBatchCoreCourse', [], async (req, res) => {
    try {
        const mydata = await Course.find({ batch: req.body.batch, courseType: 'Program Course' }).populate('Faculty').exec();
        // console.log(mydata);
        return res.json({ success: true, data: mydata });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
});

router.post('/getBatchElecCourse', [], async (req, res) => {
    try {
        const mydata = await Course.find({ batch: req.body.batch, courseType: { $ne: 'Program Course' } }).populate('Faculty').exec();
        // console.log(mydata);
        return res.json({ success: true, data: mydata });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
});

router.post('/getCourses', [], async (req, res) => {
    try {
        const mydata = await Course.find({ courseType: 'Program Course' }).populate('Faculty').exec();
        // console.log(mydata);
        return res.json({ success: true, data: mydata });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
});


router.post('/getAllCourses', [], async (req, res) => {
    try {
        const mydata = await Course.find({}).populate('Faculty').exec();
        // console.log(mydata);
        return res.json({ success: true, data: mydata });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
});

module.exports = router;
