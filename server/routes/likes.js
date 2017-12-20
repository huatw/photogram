'use strict'

const router = require('express').Router()
const {likes, users, photos} = require('../controllers')
const {requireLogin} = require('../middlewares/authorization')

router
  .param('photo', photos.load)
  .get('/photos/:photo', likes.fetch) // all liked people, {people: [], liked: true}
  .post('/photos/:photo', requireLogin, likes.like) // like pic
  .delete('/photos/:photo', requireLogin, likes.unlike) // unlike

router
  .param('user', users.load)
  .get('/users/:user', likes.fetchByUser) // all liked pic of user

module.exports = router
