'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function toggleLike ({pid, isLiked}) {
  if (isLiked) {
    return del(`/api/likes/photos/${pid}`)
  }
  return post(`/api/likes/photos/${pid}`)
}

function updatePhoto ({pid, title='', description='', tags=[]}) {
  return put(`/api/photos/${pid}`, {title, description, tags})
}

function toggleShare ({pid, isshared}) {
  return put(`/api/photos/${pid}`, {isshared})
}

function fetchPhoto (pid) {
  return get(`/api/photos/${pid}`)
    .do(res => {
      if (res.status >= 400) {
        history.push('/404')
      }
    })
}

const fetch$ = createAction()
const fetchAction$ = mergeLoader(fetch$, fetchPhoto).map(payload => ({
  payload,
  type: actionTypes.PHOTO_FETCH
}))

const update$ = createAction()
const updateAction$ = mergeLoader(update$, updatePhoto,  {isshared: null}).map(payload => ({
  payload,
  type: actionTypes.PHOTO_UPDATE
}))

const toggleShare$ = createAction()
const toggleShareAction$ = mergeLoader(toggleShare$, toggleShare, {isshared: null}).map(payload => ({
  payload,
  type: actionTypes.PHOTO_SHARE
}))

const toggleLike$ = createAction()
const toggleLikeAction$ = toggleLike$.mergeMap(toggleLike).map(payload => ({
  payload,
  type: actionTypes.PHOTO_LIKE
}))

export {
  fetch$,
  update$,
  toggleShare$,
  toggleLike$,
}

export default [
  fetchAction$,
  updateAction$,
  toggleShareAction$,
  toggleLikeAction$,
]


