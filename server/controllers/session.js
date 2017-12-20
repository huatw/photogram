'use strict'

const passport = require('passport')
const only = require('only')

function fetch (req, res) {
  res.json(only(req.user, 'username nickname thumbnail'))
}

function login (req, res, next) {
  passport.authenticate('local', (e, user, message) => {
    if (e) {
      return next(e)
    }
    if (user === false) {
      return next(message)
    }
    req.login(user, (err) => {
      if (err) {
        return next(err)
      }
      res.json(only(req.user, 'username nickname thumbnail'))
    })
  })(req, res, next)
}

function logout (req, res) {
  req.logout()
  res.json({message: 'Logged out.'})
}

module.exports = {
  login,
  logout,
  fetch
}

