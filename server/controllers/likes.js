'use strict'

const only = require('only')
const {Like} = require('../models')

async function fetchByUser (req, res) {
  const user = res.locals.user
  const likes = await Like.loadByUser(user._id)
  const retLikes = likes.map(f => {
    const retF = only(f.photo, '_id title storedname')
    retF.liketime = f.createtime
    return retF
  })
  res.json(retLikes)
}

async function fetch (req, res) {
  const photo = req.locals.photo
  const likes = await Like.loadByPhoto(photo._id)
  const retLikes = likes.map(f => {
    const retF = only(f.user, 'username nickname thumbnail')
    retF.liketime = f.createtime
    return retF
  })
  res.json(retLikes)
}

async function like (req, res, next) {
  const user = req.user
  const photo = res.locals.photo
  await Like.like(user._id, photo._id)
  res.json({isLiked: true})
}

async function unlike (req, res, next) {
  const user = req.user
  const photo = res.locals.photo
  await Like.unlike(user._id, photo._id)
  res.json({isLiked: false})
}

module.exports = {
  fetch,
  like,
  unlike,
  fetchByUser
}