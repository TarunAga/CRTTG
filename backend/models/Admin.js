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
    currentCourses : [
        {
            type : Schema.Types.ObjectId,
            ref:'course', 
        }
    ]
});

UserSchema.methods.addCourse = function(courseTBA) {
    const courseId = courseTBA.toString();
    const isDuplicate = this.currentCourses.some(course => course.toString() === courseId);
    if (!isDuplicate)this.currentCourses.push(courseTBA);
    return this.save();
}
UserSchema.methods.removeCourse = function(courseTBR) {
    this.currentCourses = this.currentCourses.filter(courseId => courseId.toString() !== courseTBR.toString());
    return this.save();
}

module.exports = mongoose.model('admin', UserSchema)