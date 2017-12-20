'use strict'

const mongoose = require('mongoose')

const LikeSchema = mongoose.Schema({
  user: { //_id of user who liked, index
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    index: true,
    required: true
  },
  photo: { // _id of photo that is liked, index.
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Photo',
    index: true,
    required: true
  },
  createtime: {
    type: Date,
    default: Date.now,
    required: true
  }
})

// using user and photo as compound index
LikeSchema.index(
  {user: 1, photo: 1},
  {unique: true}
)

LikeSchema.statics = {
  load (uid, pid) {
    return this.findOne({user: uid, photo: pid}).exec()
  },
  removeByPhoto (pid) {
    return this.deleteMany({photo: pid})
      .exec()
  },
  async like (uid, pid) {
    const oldLike = await this.load(uid, pid)
    if (oldLike) {
      const e = Error('Already liked.')
      e.status = 400
      throw e
    }
    const like = new this({user: uid, photo: pid})
    return like.save()
  },
  async unlike (uid, pid) {
    try {
      return this.deleteOne({user: uid, photo: pid})
        .exec()
    }
    catch (_) {
      const e = Error('Already unliked.')
      e.status = 400
      throw e
    }
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
  },
  countByUser (uid) {
    return this.count({user: uid}).exec()
  }
}

module.exports = mongoose.model('Like', LikeSchema)
