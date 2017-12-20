'use strict'

const router = require('express').Router()

const session = require('./session')
const users = require('./users')
const photos = require('./photos')
const groups = require('./groups')
const relation = require('./userRelation')
const likes = require('./likes')
const comments = require('./comments')
const discover = require('./discover')
const feed = require('./feed')

router
  .use('/session', session)
  .use('/users', users)
  .use('/photos', photos)
  .use('/groups', groups)
  .use('/relation', relation)
  .use('/likes', likes)
  .use('/comments', comments)
  .use('/discover', discover)
  .use('/feed', feed)


module.exports = router