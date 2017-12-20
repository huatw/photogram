'use strict'

const router = require('express').Router()
const {session} = require('../controllers')
const {requireLogin, requireLogout} = require('../middlewares/authorization')

router
  .get('/', requireLogin, session.fetch)
  .post('/', requireLogout, session.login)
  .delete('/', requireLogin, session.logout)

module.exports = router
