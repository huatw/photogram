'use strict'

const comments = require('./comments')
const groups = require('./groups')
const likes = require('./likes')
const photos = require('./photos')
const session = require('./session')
const users = require('./users')
const relation = require('./userRelation')
const tags = require('./tags')

/**
 * catch to final handler error occured in async middlewares
 * @param  {function} fn middleware function
 * @return {funcion}     wrapped function
 */
const asyncWrapFn = (fn) =>
  Object.prototype.toString.call(fn) === '[object AsyncFunction]'
    ? (...args) => fn(...args).catch(args[2])
    : fn

const asyncWrapObj = obj => Object.entries(obj).reduce(
  (acc, [key, fn]) => ({...acc, [key]: asyncWrapFn(fn)}),
  {}
)

module.exports = {
  comments: asyncWrapObj(comments),
  groups: asyncWrapObj(groups),
  likes: asyncWrapObj(likes),
  photos: asyncWrapObj(photos),
  session: asyncWrapObj(session),
  users: asyncWrapObj(users),
  relation: asyncWrapObj(relation),
  tags: asyncWrapObj(tags)
}
