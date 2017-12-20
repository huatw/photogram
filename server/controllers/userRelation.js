'use strict'

const only = require('only')
const {Relation} = require('../models')

// fetch follower
async function fetchByFollowee (req, res) {
  const followee = res.locals.user
  const followers = await Relation.loadByFollowee(followee._id)
  const retFollowers = followers.map(f =>
    only(f.follower, 'username nickname thumbnail')
  )
  if (req.user) {
    const myFollowings = await Relation.loadByFollower(req.user._id)
    const followingNames = myFollowings.map(f => f.followee.username)
    retFollowers.forEach(f => {
      f.isFollowing = followingNames.includes(f.username)
    })
  }
  res.json(retFollowers)
}

// fetch following
async function fetchByFollower (req, res) {
  const follower = res.locals.user
  const followees = await Relation.loadByFollower(follower._id)
  const retFollowees = followees.map(f =>
    only(f.followee, 'username nickname thumbnail')
  )
  if (req.user) {
    const myFollowings = await Relation.loadByFollower(req.user._id)
    const followingNames = myFollowings.map(f => f.followee.username)
    retFollowees.forEach(f => {
      f.isFollowing = followingNames.includes(f.username)
    })
  }
  res.json(retFollowees)
}

async function follow (req, res, next) {
  const follower = req.user
  const followee = res.locals.user
  await Relation.follow(follower._id, followee._id)
  const nFollowers = await Relation.countFollowers(followee._id)
  res.json({username: followee.username, isFollowing: true, nFollowers})
}

async function unfollow (req, res, next) {
  const follower = req.user
  const followee = res.locals.user
  await Relation.unfollow(follower._id, followee._id)
  const nFollowers = await Relation.countFollowers(followee._id)
  res.json({username: followee.username, isFollowing: false, nFollowers})
}

module.exports = {
  fetchByFollowee,
  fetchByFollower,
  follow,
  unfollow
}