const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
   username: String,
   password: String,
   google_id: String
});

module.exports = mongoose.model('User', userSchema)