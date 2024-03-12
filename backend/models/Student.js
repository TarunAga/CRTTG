const mongoose = require('mongoose')

const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    year:{
        type: String
    },
    batch:{
        type: String
    },
    cgpa:{
        type: String
    },
    Courses : [
        {
            type : Schema.Types.ObjectId,
            ref:'course', 
        }
    ]
});

UserSchema.methods.addCourse = function(courseTBA) {
    const courseId = courseTBA.toString();
    const isDuplicate = this.Courses.some(course => course.toString() === courseId);
    if (!isDuplicate)this.Courses.push(courseTBA);
    return this.save();
}
UserSchema.methods.removeCourse = function(courseTBR) {
    this.Courses = this.Courses.filter(courseId => courseId.toString() !== courseTBR.toString());
    return this.save();
}

module.exports = mongoose.model('student', UserSchema)