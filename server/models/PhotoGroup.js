'use strict'

const mongoose = require('mongoose')

const PhotoGroupSchema = mongoose.Schema({
  photo: { // _id of photo
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Photo',
    index: true,
    required: true
  },
  group: { // _id of group
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Group',
    index: true,
    required: true
  },
  createtime: {
    type: Date,
    default: Date.now,
    required: true
  }
})

// group x photo should be compound index
PhotoGroupSchema.index(
  {group: 1, photo: 1},
  {unique: true}
)

PhotoGroupSchema.statics = {
  load (pid, gid) {
    return this.findOne({photo: pid, group: gid})
      .exec()
  },
  loadByPhoto (pid) {
    return this.find({photo: pid})
      .populate('group')
      .sort({createtime: -1})
      .exec()
  },
  loadByGroup (gid) {
    return this.find({group: gid})
      .populate('photo')
      .sort({createtime: -1})
      .exec()
  },
  removeByPhoto (pid) {
    return this.deleteMany({photo: pid})
      .exec()
  },
  removeByGroup (gid) {
    return this.deleteMany({group: gid})
      .exec()
  },
  async addPG (pid, gid) {
    const oldRelation = await this.load(pid, gid)
    if (oldRelation) {
      const e = Error('Photo already moved in.')
      e.status = 400
      throw e
    }
    const relation = new this({photo: pid, group: gid})
    return relation.save()
  },
  async removePG (pid, gid) {
    try {
      return this.deleteOne({photo: pid, group: gid})
      .exec()
    }
    catch (_) {
      const e = Error('Photo already moved out.')
      e.status = 400
      throw e
    }
  }
}

module.exports = mongoose.model('PhotoGroup', PhotoGroupSchema)
