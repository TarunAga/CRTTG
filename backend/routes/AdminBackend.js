const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Admin = require('../models/Admin');
const Switch = require('../models/switches');
const jwt = require('jsonwebtoken');
const jwtSecret = "ISDLproject";

router.get('/getswitches', [], async (req, res) => {
    const data = await Switch.findById('6570c8afee80c31997e41c21');
    return res.json(data);
});

router.post('/updateswitches', [], async (req, res) => {
    try {
        const data = await Switch.findById('6570c8afee80c31997e41c21');
        // console.log(req.body.data);
        const copyData = req.body.data;
        data.update({
            CourseReg : copyData.CourseReg,
            CourseDrop : copyData.CourseDrop,
            timetable : copyData.timetable
        })
        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
}
);

router.post('/gentimetable', [], async (req, res) => {
    let profs = new Set();
    let courses = new Set();
    let course_profs = {};

    for (let d of req.body.data) {
        d = d.split(' ');
        let course = d[0];
        courses.add(course);
        let num_profs = parseInt(d[2]);
        for (let i = 0; i < num_profs; i++) {
            let prof = d[i + 3];
            profs.add(prof);
            if (!(course in course_profs)) {
                course_profs[course] = [];
            }
            course_profs[course].push(prof);
        }
    }

    profs = Array.from(profs).sort();
    courses = Array.from(courses).sort();

    let final = '' + profs.length + ' ' + profs.join(' ') + ' ' + courses.length + ' ' + courses.join(' ') + ' ';

    for (let course of courses) {
        final += course_profs[course].length + ' ' + course_profs[course].join(' ') + ' ';
    }

    // add here
    let batch_counts = {};
    for (let d of req.body.data) {
        d = d.split(' ');
        let batch = d[1];
        if (!(batch in batch_counts)) {
            batch_counts[batch] = 0;
        }
        batch_counts[batch]++;
    }
    final += Object.keys(batch_counts).length + ' ';

    for (let batch of Object.keys(batch_counts)) {
        final += batch + ' ';
        let courses = [];
        for (let d of req.body.data) {
            d = d.split(' ');
            if (d[1] == batch) {
                courses.push(d[0]);
            }
        }
        final += courses.length + ' ' + courses.join(' ') + ' ';
    }
    // console.log(final);
    try {
        // Write content to input file
        fs.writeFileSync('input.txt', final);

        // Execute the generator.exe after writing the file
        exec('ttgen.exe', (error, stdout, stderr) => {
            if (error) {
                console.error('Error running generator.exe:', error);
                res.status(500).send('Error running generator.exe');
                return;
            }

            // Read the generated output file
            fs.readFile('timetable.csv', 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading output file:', err);
                    res.status(500).send('Error reading output file');
                    return;
                }

                // Send the output file content in the response
                res.set('Content-Disposition', 'attachment; filename=timetable.csv');
                res.set('Content-Type', 'text/csv');
                res.send(data);

                fs.unlink('timetable.csv', (err) => {
                    if (err) {
                        console.error('Error deleting output file:', err);
                    }
                });
            });
        });
    } catch (err) {
        console.error('Error writing file:', err);
        res.status(500).send('Error writing file');
    }
});

module.exports = router;

