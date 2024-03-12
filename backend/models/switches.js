const mongoose = require('mongoose')

const { Schema } = mongoose;

const UserSchema = new Schema({
    CourseReg:{
        type: Boolean,
        required: true
    },
    CourseDrop:{
        type: Boolean,
        required: true
    },
    timetable:{
        type: String,
        required: true
    }

});
UserSchema.methods.update = function(x) {
    this.CourseReg = x.CourseReg;
    this.CourseDrop = x.CourseDrop;
    this.timetable = x.timetable;
    return this.save();
}
module.exports = mongoose.model('switch', UserSchema)