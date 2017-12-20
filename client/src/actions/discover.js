'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function fetchPhotos () {
  return get(`/api/discover`)
}

function fetchPhotosByTag (tag) {
  return get(`/api/discover/tags/${tag}`)
    .do(photos => {
      if (!Array.isArray(photos)) {
        history.push('/404')
      }
    })
}

function fetchTags () {
  return get(`/api/discover/tags`)
}

function autoSearch (name) {
  return get(`/api/discover/search/${name}`)
}

const fetch$ = createAction()
const fetchAction$ = mergeLoader(fetch$, fetchPhotos).map(payload => ({
  payload,
  type: actionTypes.DISCOVER_PHOTOS_FETCH
}))

const fetchByTag$ = createAction()
const fetchByTagAction$ = mergeLoader(fetchByTag$, fetchPhotosByTag).map(payload => ({
  payload,
  type: actionTypes.DISCOVER_PHOTOS_FETCH
}))

const fetchTags$ = createAction()
const fetchTagsAction$ = mergeLoader(fetchTags$, fetchTags).map(payload => ({
  payload,
  type: actionTypes.DISCOVER_TAGS_FETCH
}))

const autoSearch$ = createAction()
const autoSearchAction$ = autoSearch$
  .pluck('target', 'value')
  .debounceTime(600)
  .map(v => v.trim())
  .distinctUntilChanged()
  .mergeMap(v => v.length === 0
    ? fetchPhotos(v)
    : autoSearch(v)
  )
  .map(payload => ({
    payload,
    type: actionTypes.DISCOVER_PHOTOS_FETCH
  }))

export {
  fetch$,
  fetchByTag$,
  fetchTags$,
  autoSearch$
}

export default [
  fetchAction$,
  fetchByTagAction$,
  fetchTagsAction$,
  autoSearchAction$
]
