const mongoose = require('mongoose');

const { Schema } = mongoose;

const toDos = new Schema({
   content: {
      type: String, trim: true,
      required: true,
   },
   tags: [{
      type: String, trim: true, index: true
   }],
   completed: {
      type: Boolean,
      default: false
   },
   completeTime: {
      type: Date
   },
   writeTime: {
      type: Date,
      default: new Date()
   },
   _categoryId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category', 
      index: true
   },
   _userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
   },
});

module.exports = mongoose.model('ToDos', toDos);


