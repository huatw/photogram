'use strict'

const router = require('express').Router()
const {users, comments, photos} = require('../controllers')
const {requireLogin, requireCommentAuth, requirePhotoAuth} = require('../middlewares/authorization')

router
  .param('comment', comments.load)
  .put('/:comment', requireLogin, requireCommentAuth, comments.update) // update comment
  .delete('/:comment', requireLogin, requireCommentAuth, comments.remove) // remove one comment.
  // .get('/:comment', comments.fetch) // get one comment

router
  .param('photo', photos.load)
  .get('/photos/:photo', comments.fetchByPhoto) // fetch comments of pic
  .post('/photos/:photo', requireLogin, comments.create) // create a comment under a pic

router
  .param('user', users.load)
  .get('/users/:user', comments.fetchByUser) // get one's all comments

module.exports = router
