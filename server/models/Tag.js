'use strict'

const mongoose = require('mongoose')

const TagSchema = mongoose.Schema({
  tag: {
    type: String,
    index: true,
    required: true
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Photo',
    index: true,
    required: true
  },
  createtime: {
    type: Date,
    default: Date.now,
    index: true,
    required: true
  }
})

// tag x photo should be compound index
TagSchema.index(
  {tag: 1, photo: 1},
  {unique: true}
)

TagSchema.statics = {
  newTag ({tag, pid}) {
    const newTag = new this({tag, photo: pid})
    return newTag.save()
  },
  removeByPhoto (pid) {
    return this.deleteMany({photo: pid})
      .exec()
  },
  removeTags (pid, tags) {
    return this.deleteMany({photo: pid, tag: {$in: tags}})
      .exec()
  },
  addTags (pid, tags) {
    const records = tags.map(tag => ({photo: pid, tag}))
    return this.insertMany(records)
  },
  load (tag, pid) {
    return this.findOne({tag, photo: pid}).exec()
  },
  loadTags () {
  // it's not an ideal solution. should decompose to tag-pic and tag model
    return this.distinct('tag').exec()
  },
  loadByTag (tag) {
    return this.find({tag})
      .populate('photo')
      .sort({createtime: -1})
      .exec()
  },
  loadByPhoto (pid) {
    return this.find({photo: pid})
      .sort({createtime: -1})
      .exec()
  },
  // need to refactor the query
  async loadDiscoverByTag (tag) {
    const tags = await this.find({tag})
      .populate('photo')
      .sort({createtime: -1})
      .exec()

    return tags.filter(t => t.photo.isshared === true)
  }
}

module.exports = mongoose.model('Tag', TagSchema)
