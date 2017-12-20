'use strict'

const router = require('express').Router()
const {users, session} = require('../controllers')
const {requireLogin, requireLogout} = require('../middlewares/authorization')
const uploadImg = require('../middlewares/multer')

router
  .post('/', requireLogout, users.register, session.login)
  .put('/', requireLogin, users.update)
  .post('/thumbnail', requireLogin, uploadImg.single('thumbnail'), users.updateThumbnail)

router
  .param('user', users.load)
  .get('/:user', users.fetch)

module.exports = router
