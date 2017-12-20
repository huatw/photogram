'use strict'

const router = require('express').Router()
const {photos, tags} = require('../controllers')
const {requireLogin} = require('../middlewares/authorization')

router
  .get('/', requireLogin, photos.fetchFeed)
  // .param('tag', tags.load)
  // .get('/tags/:tag', requireLogin, tags.fetchFeed)

module.exports = router
