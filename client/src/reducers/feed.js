'use strict'

import {combineReducers} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function photosReducer (state, action) {
  switch (action.type) {
    case actionTypes.FEED_FETCH:
      return action.payload
    default:
      return state
  }
}

const feedReducer = combineReducers({
  photos: photosReducer,
  //tags
})

export default feedReducer
