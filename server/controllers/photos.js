'use strict'

const only = require('only')
const {User, Photo, Like, PhotoGroup, Relation, Tag} = require('../models')

async function load (req, res, next, pid) {
  res.locals.photo = await Photo.load(pid)
  if (res.locals.photo) {
    return next()
  }
  const e = Error('Photo not found.')
  e.status = 404
  next(e)
}

async function remove (req, res) {
  const pid = res.locals.photo._id
  await Promise.all([
    Tag.removeByPhoto(pid),
    Like.removeByPhoto(pid),
    PhotoGroup.removeByPhoto(pid),
    /* todo remove comment like*/
    // remove comments
  ])

  const photo = await res.locals.photo.remove()
  res.json(only(photo, '_id'))
}

async function update (req, res) {
  if (req.body.isshared !== undefined) {
    Object.assign(res.locals.photo, only(req.body, 'isshared'))
    const retP = await res.locals.photo.save()
    return res.json(only(retP, 'isshared'))
  }
  Object.assign(res.locals.photo, only(req.body, 'title description'))
  const savedPhoto = await res.locals.photo.save()
  const retP = only(savedPhoto, 'title description isshared')

  const pid = res.locals.photo._id
  let oldTags = await Tag.loadByPhoto(pid)
  oldTags = oldTags.map(t => t.tag)
  const newTags = req.body.tags
  const removeTags = oldTags.filter(t => !newTags.includes(t))
  const addTags = newTags.filter(t => !oldTags.includes(t))

  await Tag.removeTags(pid, removeTags)
  await Tag.addTags(pid, addTags)

  retP.tags = newTags
  return res.json(retP)
}

async function upload (req, res, next) {
  if (!req.files) {
    const e = Error('Upload photo failed.')
    e.status = 400
    return next(e)
  }
  const files = req.files.map(file => ({
    storedname: file.filename,
    title: file.originalname,
    user: req.user._id
  }))
  const photos = await Photo.insertMany(files)
  const retPhotos = photos.map(p => only(p, '_id title storedname createtime'))
  res.json(retPhotos)
}

// one's all photos
async function fetchByUser (req, res) {
  const isOwner = req.user && res.locals.user.username === req.user.username
  const photos = isOwner
    // viewing your own photo, list all
    ? await Photo.loadByUser(req.user._id)
    // only shared photo viewable
    : await Photo.loadSharedByUser(res.locals.user._id)

  const retPhotos = photos.map(p =>
    only(p, '_id title description storedname isshared createtime')
  )
  res.json(retPhotos)
}

async function fetch (req, res, next) {
  const pid = res.locals.photo._id
  const photo = only(res.locals.photo, '_id title description storedname isshared createtime')
  photo.user = only(res.locals.photo.user, 'username nickname thumbnail')

  const isLogin = req.isAuthenticated()
  const isOwner = isLogin && res.locals.photo.user.username === req.user.username

  const tags = await Tag.loadByPhoto(pid)
  photo.tags = tags.map(t => t.tag)

  if (!isOwner && !photo.isshared) {
    const e = Error('Photo not viewable')
    e.status = 404
    return next(e)
  }
  else if (isLogin) {
    const isLiked = await Like.load(req.user._id, pid)
    photo.isLiked = isLiked ? true : false
    if (isOwner) {
      const photoGroups = await PhotoGroup.loadByPhoto(res.locals.photo._id)
      photo.groups = photoGroups.map(pg => only(pg.group, '_id title'))
    }
  }
  res.json(photo)
}

async function fetchDiscover (req, res) {
  const photos = await Photo.loadDiscover()
  const retPhotos = photos.map(p =>
    only(p, '_id title storedname')
  )
  res.json(retPhotos)
}

async function fetchDiscoverByWord (req, res) {
  const word = req.params.word
  const photos = await Photo.loadDiscoverByWord(word)
  const retPhotos = photos.map(p =>
    only(p, '_id title storedname')
  )
  res.json(retPhotos)
}

/* naive feed design... should use redis */
async function fetchFeed (req, res) {
  const user = req.user
  const relation = await Relation.loadByFollower(user._id)
  const followees = relation.map(f => f.followee._id)
  followees.push(user._id)
  const photos = await Photo.loadFeed(followees)

  const retPhotos = photos.map(p => {
    const retP = only(p, '_id title storedname createtime')
    retP.user = only(p.user, 'username nickname thumbnail')
    return retP
  })
  res.json(retPhotos)
}

module.exports = {
  load,
  fetch,
  remove,
  update,
  upload,
  fetchByUser,
  fetchDiscover,
  fetchDiscoverByWord,
  fetchFeed
}