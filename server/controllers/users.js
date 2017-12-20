'use strict'

const only = require('only')
const {User, Relation, Like, Group, Photo} = require('../models')

async function register (req, res, next) {
  try {
    await User.register(req.body)
  }
  catch (e) {
    e.status = 403
    next(e)
  }
  next()
}

async function load (req, res, next, username) {
  res.locals.user = await User.load(username)
  if (res.locals.user) {
    return next()
  }
  const e = Error('User not found.')
  e.status = 404
  next(e)
}

async function fetch (req, res, next) {
  const uid = res.locals.user._id
  const profile = only(res.locals.user, 'username nickname thumbnail')
  profile.nFollowees = await Relation.countFollowees(uid)
  profile.nFollowers = await Relation.countFollowers(uid)
  profile.nLikes = await Like.countByUser(uid)

  // owner
  if (req.user && req.user.username === res.locals.user.username) {
    profile.nGroups = await Group.countGroups(uid)
    profile.nPhotos = await Photo.countPhotos(uid)
  }
  else {
    profile.nPhotos = await Photo.countShared(uid)
    // log in & not owner
    if (req.user && req.user.username) {
      const relation = await Relation.load(uid, req.user._id)
      profile.isFollowing = relation ? true : false
    }
  }

  res.json(profile)
}

async function update (req, res, next) {
  Object.assign(req.user, only(req.body, 'password nickname'))
  const user = await req.user.save()
  res.json(only(user, 'username nickname email thumbnail'))
}

async function updateThumbnail (req, res, next) {
  if (!req.file) {
    const e = Error('Upload photo thumbnail failed.')
    e.status = 400
    return next(e)
  }
  Object.assign(req.user, {thumbnail: req.file.filename})
  const retUser = await req.user.save()
  res.json(only(retUser, 'username thumbnail'))
}

module.exports = {
  load,
  register,
  fetch,
  update,
  updateThumbnail
}
