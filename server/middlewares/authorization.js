'use strict'

function requireLogout (req, res, next) {
  if (req.isAuthenticated()) {
    const e = Error('Already logged in.')
    e.status = 403
    return next(e)
  }
  next()
}

function requireLogin (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  const e = Error('Please Login first.')
  e.status = 401
  next(e)
}

function requireUserAuth (req, res, next) {
  if (res.locals.user.username === req.user.username) {
    return next()
  }
  const e = Error('Unauthorized operation to user.')
  e.status = 401
  next(e)
}

function requirePhotoAuth (req, res, next) {
  if (res.locals.photo.user.username === req.user.username) {
    return next()
  }
  const e = Error('Unauthorized operation to photo.')
  e.status = 401
  next(e)
}

function requireGroupAuth (req, res, next) {
  if (res.locals.group.user.username === req.user.username) {
    return next()
  }
  const e = Error('Unauthorized operation to group.')
  e.status = 401
  next(e)
}

function requireCommentAuth (req, res, next) {
  if (res.locals.comment.user.username === req.user.username) {
    return next()
  }
  const e = Error('Unauthorized operation to comment.')
  e.status = 401
  next(e)
}

module.exports = {
  requireLogin,
  requireLogout,
  requireUserAuth,
  requirePhotoAuth,
  requireGroupAuth,
  requireCommentAuth
}
