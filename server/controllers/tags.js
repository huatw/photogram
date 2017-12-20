'use strict'

const only = require('only')
const {Tag} = require('../models')

async function load (req, res, next, tag) {
  res.locals.tag = tag
  next()
}

// ?? no usage yet
async function create (req, res, next) {
  try {
    const tag = await Tag.newTag(req.body)
    res.json(only(tag, 'tag photo'))
  }
  catch (e) {
    e.status = 403
    next(e)
  }
}

async function fetchDiscover (req, res) {
  const tagPhotos = await Tag.loadDiscoverByTag(res.locals.tag)
  const retTagPhotos = tagPhotos.map(tp =>
    only(tp.photo, '_id title storedname')
  )
  res.json(retTagPhotos)
}

async function fetch (req, res) {
  const tags = await Tag.loadTags()
  res.json(tags)
}

module.exports = {
  load,
  fetchDiscover,
  fetch
}
