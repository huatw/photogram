'use strict'

const only = require('only')
const {Comment} = require('../models')

async function load (req, res, next, cid) {
  res.locals.comment = await Comment.load(cid)
  if (res.locals.comment) {
    return next()
  }
  const e = Error('Comment not found.')
  e.status = 404
  next(e)
}

async function remove (req, res) {
  await res.locals.comment.remove()
  res.json({message: 'Comment deleted.'})
}

async function update (req, res) {
  Object.assign(res.locals.comment, only(req.body, 'content'))
  await res.locals.comment.save()
  res.json(only(res.locals.comment, 'content'))
}

async function create (req, res, next) {
  try {
    req.body.user = req.user._id
    req.body.photo = res.locals.photo._id
    const comment = await Comment.newComment(req.body)
    res.json(only(comment, '_id content createtime'))
  }
  catch (e) {
    e.status = 403
    next(e)
  }
}

async function fetchByPhoto (req, res) {
  const photo = res.locals.photo
  const comments = await Comment.loadByPhoto(photo._id)

  const retComments = comments.map(c => {
    const retC = only(c, '_id content createtime')
    retC.user = only(c.user, 'username nickname thumbnail')
    return retC
  })
  res.json(retComments)
}

async function fetchByUser (req, res) {
  const user = res.locals.user
  const comments = await Comment.loadByUser(user._id)

  const retComments = comments.map(c => {
    c.photo = only(c.photo, '_id title storedname')
    return only(c, '_id photo content createtime')
  })
  res.json(retComments)
}

module.exports = {
  load,
  create,
  remove,
  update,
  fetchByPhoto,
  fetchByUser
}