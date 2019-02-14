const mongoose = require('mongoose');

const { Schema } = mongoose;

const category = new Schema({
   category: {
      type: String, trim: true
   },
   _userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
   },
});

module.exports = mongoose.model('Category', category);
