'use strict'

const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
  //_id primary key
  user: { // _id of user who comments the photo, index.
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    index: true,
    required: true
  },
  photo: { // _id of photo that is commented, index.
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Photo',
    index: true,
    required: true
  },
  content: { // comment content
    type: String,
    require: true
  },
  createtime: {
    type: Date,
    default: Date.now,
    required: true
  }
})

CommentSchema.statics = {
  load (_id) {
    return this.findOne({_id})
      .populate('user')
      .populate('photo')
      .exec()
  },
  newComment ({user, photo, content}) {
    const comment = new this({user, photo, content})
    return comment.save()
  },
  loadByUser (uid) {
    return this.find({user: uid})
      .populate('photo')
      .sort({createtime: -1})
      .exec()
  },
  loadByPhoto (pid) {
    return this.find({photo: pid})
      .populate('user')
      .sort({createtime: -1})
      .exec()
  }
}

module.exports = mongoose.model('Comment', CommentSchema)
