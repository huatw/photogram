'use strict'

import {combineReducers} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function profileReducer (state, action) {
  switch (action.type) {
    case actionTypes.USER_PROFILE_FETCH:
      return action.payload
    case actionTypes.USER_PROFILE_FOLLOW:
    case actionTypes.USER_PROFILE_UPDATE:
      return {
        ...state,
        ...action.payload
      }
    case actionTypes.USER_PHOTOS_UPLOAD:
      return {
        ...state,
        nPhotos: state.nPhotos + action.payload.length
      }
    case actionTypes.USER_PHOTOS_REMOVE:
      return {
        ...state,
        nPhotos: state.nPhotos - 1
      }
    case actionTypes.USER_GROUPS_REMOVE:
      return {
        ...state,
        nGroups: state.nGroups - 1
      }
    case actionTypes.USER_GROUPS_CREATE:
      return {
        ...state,
        nGroups: state.nGroups + 1
      }
    case actionTypes.USER_FOLLOWEES_FOLLOW:
    case actionTypes.USER_FOLLOWERS_FOLLOW:
      const addN = action.payload.addN
      return addN
        ? {
          ...state,
          nFollowees: state.nFollowees + addN
        }
        : state
    default:
      return state
  }
}

function photosReducer (state, action) {
  switch (action.type) {
    case actionTypes.USER_PHOTOS_FETCH:
      return action.payload
    case actionTypes.USER_PHOTOS_REMOVE:
      return state.filter(photo => photo._id !== action.payload._id)
    case actionTypes.USER_PHOTOS_UPLOAD:
      return [
        ...action.payload,
        ...state
      ]
    default:
      return state
  }
}

function groupsReducer (state, action) {
  switch (action.type) {
    case actionTypes.USER_GROUPS_FETCH:
      return action.payload
    case actionTypes.USER_GROUPS_REMOVE:
      return state.filter(group => group._id !== action.payload._id)
    case actionTypes.USER_GROUPS_CREATE:
      return [
        action.payload,
        ...state
      ]
    default:
      return state
  }
}

function likesReducer (state, action) {
  switch (action.type) {
    case actionTypes.USER_LIKES_FETCH:
      return action.payload
    default:
      return state
  }
}

function followeesReducer (state, action) {
  switch (action.type) {
    case actionTypes.USER_FOLLOWEES_FETCH:
      return action.payload
    case actionTypes.USER_FOLLOWEES_FOLLOW:
      return state.reduce((acc, r) => {
        if (r.username === action.payload.username) {
          acc.push({
            ...r,
            ...action.payload
          })
        }
        else {
          acc.push(r)
        }
        return acc
      }, [])
    default:
      return state
  }
}

function followersReducer (state, action) {
  switch (action.type) {
    case actionTypes.USER_FOLLOWERS_FETCH:
      return action.payload
    case actionTypes.USER_FOLLOWERS_FOLLOW:
      return state.reduce((acc, r) => {
        if (r.username === action.payload.username) {
          acc.push({
            ...r,
            ...action.payload
          })
        }
        else {
          acc.push(r)
        }
        return acc
      }, [])
    default:
      return state
  }
}

const userReducer = combineReducers({
  profile: profileReducer,
  photos: photosReducer,
  groups: groupsReducer,
  likes: likesReducer,
  followees: followeesReducer,
  followers: followersReducer
})

export default userReducer
