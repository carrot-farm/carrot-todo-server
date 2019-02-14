const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
   email: {
      type: String, required: true, unique: true, lowercase: true,
      index: true
   },
   password: {
      type: String, trimg: true
   },
   nickname: {
      type: String, unique: true, trim: true,
   },
   strategy: {
      type: String, require: true
   },
   strategyId: String,
   joinTime: {
      type: Date, default: Date.now, require: true
   },
   joinIp: {
      type: String, require: true
   }
});

module.exports = mongoose.model('User', userSchema);


