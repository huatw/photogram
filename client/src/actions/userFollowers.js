'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function fetchFollowers (username) {
  return get(`/api/relation/followees/${username}`)
}

const fetchFollowers$ = createAction()
const fetchFollowersAction$ = mergeLoader(fetchFollowers$, fetchFollowers).map(payload => ({
  payload,
  type: actionTypes.USER_FOLLOWERS_FETCH
}))

function toggleFollow ({username, isFollowing, isOwner}) {
  const $ = isFollowing
    ? del(`/api/relation/followees/${username}`)
    : post(`/api/relation/followees/${username}`)
  return $.map(res => isOwner
    ? ({...res, addN: isFollowing ? -1 : 1})
    : res
  )
}

const toggleFollow$ = createAction()
const toggleFollowAction$ = Rx.Observable
  .merge(
    toggleFollow$.map(({username}) => ({username, isFollowing: null})),
    toggleFollow$.mergeMap(toggleFollow)
  )
  .map(payload => ({
    payload,
    type: actionTypes.USER_FOLLOWERS_FOLLOW
  }))

export {
  fetchFollowers$,
  toggleFollow$
}

export default [
  fetchFollowersAction$,
  toggleFollowAction$
]
