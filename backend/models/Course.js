const mongoose = require('mongoose')

const { Schema } = mongoose;

const UserSchema = new Schema({
    courseId:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    batch:{
        type: String,
        required: true
    },
    credits:{
        type: String,
        required: true
    },
    seats:{
        type: String,
        required: true
    },
    courseType:{
        type: String
    },
    Faculty : [
        {
            type : Schema.Types.ObjectId,
            ref:'faculty', 
        }
    ],
    Students : [
        {
            type : Schema.Types.ObjectId,
            ref:'student', 
        }
    ],
});
UserSchema.methods.addStudent = function(studentTBA) {
    const studentId = studentTBA.toString();
    const isDuplicate = this.Students.some(student => student.toString() === studentId);
    if (!isDuplicate)this.Students.push(studentTBA);
    return this.save();
}
UserSchema.methods.removeStudent = function(studentTBR) {
    this.Students = this.Students.filter(studentId => studentId.toString() !== studentTBR.toString());
    return this.save();
}
UserSchema.methods.update = function(x) {
    this.facultyId = x.facultyId;
    this.name = x.name;
    this.batch = x.batch;
    this.credits = x.credits;
    this.Faculty = x.Faculty;
    this.courseType = x.courseType;
    this.Students = x.Students;
    return this.save();
}

module.exports = mongoose.model('course', UserSchema)