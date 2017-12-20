'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function fetchPhotos () {
  return get(`/api/feed`)
    .map(photos => Array.isArray(photos) ? photos : [])
}

const fetch$ = createAction()
const fetchAction$ = mergeLoader(fetch$, fetchPhotos).map(payload => ({
  payload,
  type: actionTypes.FEED_FETCH
}))

export {
  fetch$
}

export default [
  fetchAction$
]


