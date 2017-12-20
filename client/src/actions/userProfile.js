'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function fetchProfile (username) {
  return get(`/api/users/${username}`)
    .do(({username}) => {
      // user not exist
      if (!username) {
        history.push('/404')
      }
    })
}

function toggleFollow ({username, isFollowing}) {
  if (isFollowing) {
    return del(`/api/relation/followees/${username}`)
  }
  return post(`/api/relation/followees/${username}`)
}

const fetchProfile$ = createAction()
const fetchProfileAction$ = mergeLoader(fetchProfile$, fetchProfile).map(payload => ({
  payload,
  type: actionTypes.USER_PROFILE_FETCH
}))

const toggleFollow$ = createAction()
const toggleFollowAction$ = mergeLoader(toggleFollow$, toggleFollow, {isFollowing: null}).map(payload => ({
  payload,
  type: actionTypes.USER_PROFILE_FOLLOW
}))

function updateThumbnail (file) {
  const formData = new FormData()
  formData.append('thumbnail', file)
  return post(`/api/users/thumbnail`, formData)
}

const updateThumbnail$ = createAction()
const updateThumbnailAction$ = updateThumbnail$.mergeMap(updateThumbnail).map(payload => ({
  payload,
  type: actionTypes.USER_PROFILE_UPDATE
}))

export {
  fetchProfile$,
  toggleFollow$,
  updateThumbnail$,
}

export default [
  fetchProfileAction$,
  toggleFollowAction$,
  updateThumbnailAction$,
]
