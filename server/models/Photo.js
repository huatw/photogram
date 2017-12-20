'use strict'

const mongoose = require('mongoose')

const PhotoSchema = mongoose.Schema({
  // primary key, A global unique identifier to represent photo
  user: { //_id of photo owner, index.
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    index: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  storedname: { // Stored path of photo, invisible to user.
    type: String,
    required: true
  },
  isshared: { // shared photo will be viewed by all user.
    type: Boolean,
    default: false
  },
  sharetime: { // check sharetime -> show to public
    type: Date,
    index: true
  },
  createtime: {
    type: Date,
    index: true,
    required: true,
    default: Date.now
  }
})

PhotoSchema.pre('save', async function (next) {
  if (this.isModified('isshared') && this.isshared === true) {
    this.sharetime = Date.now()
  }
  next()
})

PhotoSchema.statics = {
  load (_id) {
    return this.findOne({_id})
      .populate('user')
      .exec()
  },
  loadByUser (uid) {
    return this.find({user: uid})
      .sort({createtime: -1})
      .exec()
  },
  loadSharedByUser (uid) {
    return this.find({user: uid, isshared: true})
      .sort({sharetime: -1})
      .exec()
  },
  countPhotos (uid) {
    return this.count({user: uid})
      .exec()
  },
  countShared (uid) {
    return this.count({user: uid, isshared: true})
      .exec()
  },
  loadDiscover () {
    return this.find({isshared: true})
      .limit(20)
      .sort({sharetime: -1})
      .exec()
  },
  loadDiscoverByWord (word) {
    return this.find({
      isshared: true,
      title: {$regex: word, $options: 'i' }
    })
      .limit(20)
      .sort({sharetime: -1})
      .exec()
  },
  loadFeed (uids) {
    return this.find({user: {$in: uids}, isshared: true})
      .limit(20)
      .sort({sharetime: -1})
      .exec()
  }
}

module.exports = mongoose.model('Photo', PhotoSchema)