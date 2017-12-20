'use strict'

import {combineReducers} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function photoReducer (state, action) {
  switch (action.type) {
    case actionTypes.PHOTO_FETCH:
      return action.payload
    case actionTypes.PHOTO_UPDATE:
    case actionTypes.PHOTO_SHARE:
    case actionTypes.PHOTO_LIKE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export default photoReducer
