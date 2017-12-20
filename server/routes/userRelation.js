'use strict'

const router = require('express').Router()
const {relation, users} = require('../controllers')
const {requireLogin} = require('../middlewares/authorization')

router
  .param('user', users.load) // ensure param is a user
  .get('/followers/:user', relation.fetchByFollower) // one's following
  .get('/followees/:user', relation.fetchByFollowee) // one's followers
  .post('/followees/:user', requireLogin, relation.follow) // user follow someone
  .delete('/followees/:user', requireLogin, relation.unfollow) // user unfollow

module.exports = router
