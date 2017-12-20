'use strict'

import {combineReducers} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function tagsReducer (state, action) {
  switch (action.type) {
    case actionTypes.DISCOVER_TAGS_FETCH:
      return action.payload
    default:
      return state
  }
}

function photosReducer (state, action) {
  switch (action.type) {
    case actionTypes.DISCOVER_PHOTOS_FETCH:
      return action.payload
    default:
      return state
  }
}

const discoverReducer = combineReducers({
  tags: tagsReducer,
  photos: photosReducer
})

export default discoverReducer
