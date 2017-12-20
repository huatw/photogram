'use strict'

const only = require('only')
const {Group, PhotoGroup} = require('../models')

async function load (req, res, next, gid) {
  res.locals.group = await Group.load(gid)
  if (res.locals.group) {
    return next()
  }
  const e = Error('Group not found.')
  e.status = 404
  next(e)
}

async function remove (req, res) {
  const group = res.locals.group
  await PhotoGroup.removeByGroup(group._id)
  const retGroup = await group.remove()
  res.json(only(retGroup, '_id'))
}

async function update (req, res) {
  Object.assign(res.locals.group, only(req.body, 'title description'))
  const savedGroup = await res.locals.group.save()
  res.json(only(savedGroup, 'title description updatetime'))
}

async function updateThumbnail (req, res, next) {
  if (!req.file) {
    const e = Error('Upload group thumbnail failed.')
    e.status = 400
    return next(e)
  }
  const group = res.locals.group
  Object.assign(group, {thumbnail: req.file.filename})
  const retGroup = await group.save()
  res.json(only(retGroup, '_id thumbnail'))
}

async function create (req, res, next) {
  try {
    req.body.user = req.user._id
    const group = await Group.newGroup(req.body)
    res.json(only(group, '_id title description thumbnail createtime'))
  }
  catch (e) {
    e.status = 403
    next(e)
  }
}

async function fetchByUser (req, res) {
  const groups = await Group.loadByUser(req.user._id)

  const retGroups = groups.map(p =>
    only(p, '_id title description thumbnail updatetime')
  )
  res.json(retGroups)
}

async function fetch (req, res, next) {
  const group = only(res.locals.group, '_id title description thumbnail updatetime')
  const isOwner = req.user && (res.locals.group.user.username === req.user.username)
  if (!isOwner) {
    const e = Error('Group not viewable.')
    e.status = 404
    return next(e)
  }

  const photos = await PhotoGroup.loadByGroup(res.locals.group._id)
  group.photos = photos.map(p => only(p.photo, '_id title storedname'))

  res.json(group)
}

async function addPhoto (req, res, next) {
  const group = res.locals.group
  const photo = res.locals.photo
  const relation = await PhotoGroup.addPG(photo._id, group._id)
  res.json({message: 'Photo added.'})
}

async function removePhoto (req, res, next) {
  const group = res.locals.group
  const photo = res.locals.photo
  await PhotoGroup.removePG(photo._id, group._id)
  res.json(only(photo, '_id title'))
}

async function fetchGroupByPhoto (req, res, next) {
  const photo = res.locals.photo
  const pGroups = await PhotoGroup.loadByPhoto(photo._id)
  const retGroups = pGroups.map(pg => only(pg.group, '_id title'))
  res.json(retGroups)
}

module.exports = {
  load,
  create,
  fetch,
  remove,
  update,
  updateThumbnail,
  fetchByUser,
  addPhoto,
  removePhoto,
  fetchGroupByPhoto
}