'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function fetchFollowees (username) {
  return get(`/api/relation/followers/${username}`)
}

const fetchFollowees$ = createAction()
const fetchFolloweesAction$ = mergeLoader(fetchFollowees$, fetchFollowees).map(payload => ({
  payload,
  type: actionTypes.USER_FOLLOWEES_FETCH
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
    type: actionTypes.USER_FOLLOWEES_FOLLOW
  }))

export {
  fetchFollowees$,
  toggleFollow$
}

export default [
  fetchFolloweesAction$,
  toggleFollowAction$
]
