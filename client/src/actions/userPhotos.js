'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

import {inputMsg$} from './notification'

function fetchPhotos (username) {
  return get(`/api/photos/users/${username}`)
}

function uploadPhotos ({files, username}) {
  const formData = new FormData()
  ;[...files].forEach(file => formData.append('imgs', file))
  return post(`/api/photos`, formData)
    .map(res => {
      if (Array.isArray(res)) {
        history.push(`/${username}/photos`)
        return res
      }
      else {
        inputMsg$.next(res.message)
        return []
      }
    })
}

function removePhoto (pid) {
  return del(`/api/photos/${pid}`)
}

const fetchPhotos$ = createAction()
const fetchPhotosAction$ = mergeLoader(fetchPhotos$, fetchPhotos).map(payload => ({
  payload,
  type: actionTypes.USER_PHOTOS_FETCH
}))

const uploadPhotos$ = createAction()
const uploadPhotosAction$ = uploadPhotos$.mergeMap(uploadPhotos).map(payload => ({
  payload,
  type: actionTypes.USER_PHOTOS_UPLOAD
}))

const removePhoto$ = createAction()
const removePhotoAction$ = removePhoto$.mergeMap(removePhoto).map(payload => ({
  payload,
  type: actionTypes.USER_PHOTOS_REMOVE
}))

export {
  fetchPhotos$,
  uploadPhotos$,
  removePhoto$,
}

export default [
  fetchPhotosAction$,
  uploadPhotosAction$,
  removePhotoAction$
]
