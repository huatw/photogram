'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const {thumbnailStr, saltRounds} = require('../config')

const UserSchema = mongoose.Schema({
  // _id ? A global unique identifier to represent user, auto index.
  username: {
    type: String,
    unique: true,
    index: true,
    required: true,
    minlength: 1
  },
  // Hashed password of user.
  password: {type: String, required: true},
  nickname: {
    type: String,
    required: true,
    minlength: 1
  },
  email: {type: String, default: ''},
  // _id of icon photo of user.
  thumbnail: {type: String, default: thumbnailStr},
  createtime: {
    type: Date,
    default: Date.now,
    required: true
  }
})

// auto hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const password = await bcrypt.hash(this.password, saltRounds)
    this.password = password
  }
  next()
})

UserSchema.methods = {
  async comparePassword (cleanPassword) {
    const isMatched = await bcrypt.compare(cleanPassword, this.password)
    return isMatched
  }
}

UserSchema.statics = {
  load (username) {
    return this.findOne({username})
      .exec()
  },
  register ({username, password, nickname, email}) {
    const user = new this({username, password, nickname, email})
    return user.save()
  }
}

module.exports = mongoose.model('User', UserSchema)
