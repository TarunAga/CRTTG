const mongoose = require('mongoose');
const mongoDb = async() => {
    await mongoose.connect('mongodb+srv://21ucs149:crttglnmiit@cluster0.zchbutz.mongodb.net/?retryWrites=true&w=majority', async() => {
        console.log("connected");
    });
}

module.exports = mongoDb;