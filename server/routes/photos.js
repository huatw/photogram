'use strict'

const router = require('express').Router()
const {users, photos} = require('../controllers')
const {requireLogin, requirePhotoAuth} = require('../middlewares/authorization')
const uploadImg = require('../middlewares/multer')

router
  .param('photo', photos.load)
  .get('/:photo', photos.fetch) // get pic
  .delete('/:photo', requireLogin, requirePhotoAuth, photos.remove) // remove pic
  .put('/:photo', requireLogin, requirePhotoAuth, photos.update) // modify pic profile

router
  .param('user', users.load)
  .get('/users/:user', photos.fetchByUser) // fetch one's all pic

router
  .post('/', requireLogin, uploadImg.array('imgs'), photos.upload) // upload pic
  // need to requirePhotoAuth all the list item
  // .put('/', requireLogin, photos.removeList) // remove a group of pic

module.exports = router
