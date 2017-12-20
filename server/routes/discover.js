'use strict'

const router = require('express').Router()
const {photos, tags} = require('../controllers')

router
  .get('/', photos.fetchDiscover)
  .get('/search/:word', photos.fetchDiscoverByWord)
  .get('/tags', tags.fetch)
  .param('tag', tags.load)
  .get('/tags/:tag', tags.fetchDiscover)

module.exports = router
