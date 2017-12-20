'use strict'

const mongoose = require('mongoose')
const {groupcoverStr} = require('../config')

// photos String Array Array of _id of photo that is included by this group.
const GroupSchema = mongoose.Schema({
  // _id primary key, A global unique identifier to represent group.
  user: { //_id of Group owner, index.
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    index: true,
    required: true
  },
  title: { // Title of Group, could be modified by user.
    type: String,
    require: true
  },
  description: {// Description of Group, could be modified by user.
    type: String,
    default: ''
  },
  thumbnail: { //path of cover photo
    type: String,
    default: groupcoverStr
  },
  updatetime: {
    type: Date,
    default: Date.now
  },
  createtime: {
    type: Date,
    default: Date.now,
    required: true
  }
})

GroupSchema.pre('save', async function (next) {
  this.updatetime = Date.now()
  next()
})

GroupSchema.statics = {
  load (_id) {
    return this.findOne({_id})
      .populate('user')
      .exec()
  },
  newGroup ({user, title, description}) {
    const group = new this({user, title, description})
    return group.save()
  },
  loadByUser (uid) {
    return this.find({user: uid})
      .sort({createtime: -1})
      .exec()
  },
  countGroups (uid) {
    return this.count({user: uid})
      .exec()
  }
}

module.exports = mongoose.model('Group', GroupSchema)
