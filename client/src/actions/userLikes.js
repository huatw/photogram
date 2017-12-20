'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function fetchLikes (username) {
  return get(`/api/likes/users/${username}`)
}

const fetchLikes$ = createAction()
const fetchLikesAction$ = mergeLoader(fetchLikes$, fetchLikes).map(payload => ({
  payload,
  type: actionTypes.USER_LIKES_FETCH
}))

export {
  fetchLikes$,
}

export default [
  fetchLikesAction$,
]
