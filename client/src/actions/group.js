'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

import {inputMsg$} from './notification'

function updateGroup ({gid, title='', description=''}) {
  return put(`/api/groups/${gid}`, {title, description})
}

function fetchGroup (gid) {
  return get(`/api/groups/${gid}`)
    .do(res => {
      // unauthed
      if (res.status >= 400) {
        history.push('/404')
      }
    })
}

const fetch$ = createAction()
const fetchAction$ = mergeLoader(fetch$, fetchGroup).map(payload => ({
  payload,
  type: actionTypes.GROUP_FETCH
}))

const update$ = createAction()
const updateAction$ = mergeLoader(update$, updateGroup, {updatetime: null}).map(payload => ({
  payload,
  type: actionTypes.GROUP_UPDATE
}))


function addPhotoGroup ({pid, gid}) {
  return post(`/api/groups/${gid}/photos/${pid}`)
    .do(res => {
      inputMsg$.next(res.message)
    })
}

function removePhotoGroup ({pid, gid}) {
  return del(`/api/groups/${gid}/photos/${pid}`)
    .do(res => {
      if (res.status >= 400) {
        inputMsg$.next(res.message)
      }
    })
}

// payload not used by reducer, only for side effect.
const addPhotoGroup$ = createAction()
const addPhotoGroupAction$ = addPhotoGroup$.mergeMap(addPhotoGroup)
// .map(payload => ({
//   payload,
//   type: actionTypes.PHOTOGROUP_ADD
// }))

const removePhotoGroup$ = createAction()
const removePhotoGroupAction$ = removePhotoGroup$.mergeMap(removePhotoGroup)
  .map(payload => ({
    payload,
    type: actionTypes.PHOTOGROUP_REMOVE
  }))

function updateThumbnail ({gid, file}) {
  const formData = new FormData()
  formData.append('thumbnail', file)
  return post(`/api/groups/${gid}/thumbnail`, formData)
}

const updateThumbnail$ = createAction()
const updateThumbnailAction$ = updateThumbnail$.mergeMap(updateThumbnail).map(payload => ({
  payload,
  type: actionTypes.GROUP_UPDATE
}))

export {
  fetch$,
  update$,
  addPhotoGroup$,
  removePhotoGroup$,
  updateThumbnail$,
}

export default [
  fetchAction$,
  updateAction$,
  addPhotoGroupAction$,
  removePhotoGroupAction$,
  updateThumbnailAction$,
]
