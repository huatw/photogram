'use strict'

const mongoose = require('mongoose')

const UserRelationSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    index: true,
    required: true
  },
  followee: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    index: true,
    required: true
  },
  createtime: {
    type: Date,
    default: Date.now,
    required: true
  }
})

// follower x followee should be compound index
UserRelationSchema.index(
  {follower: 1, followee: 1},
  {unique: true}
)

UserRelationSchema.statics = {
  load (followee, follower) {
    return this.findOne({follower, followee}).exec()
  },
  countFollowers (followee) {
    return this.count({followee}).exec()
  },
  countFollowees (follower) {
    return this.count({follower}).exec()
  },
  async follow (follower, followee) {
    const oldRelation = await this.load(followee, follower)
    if (oldRelation) {
      const e = Error('Already followed.')
      e.status = 400
      throw e
    }
    const relation = new this({follower, followee})
    return relation.save()
  },
  async unfollow (follower, followee) {
    try {
      return this.deleteOne({follower, followee})
        .exec()
    }
    catch (_) {
      const e = Error('Already unfollowed.')
      e.status = 400
      throw e
    }
  },
  loadByFollowee (followee) {
    return this.find({followee})
      .populate('follower')
      .sort({createtime: -1})
      .exec()
  },
  loadByFollower (follower) {
    return this.find({follower})
      .populate('followee')
      .sort({createtime: -1})
      .exec()
  }
}

module.exports = mongoose.model('UserRelation', UserRelationSchema)
