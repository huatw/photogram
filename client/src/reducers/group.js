'use strict'

import {combineReducers} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function groupReducer (state, action) {
  switch (action.type) {
    case actionTypes.GROUP_FETCH:
      return action.payload
    case actionTypes.GROUP_UPDATE:
      return {
        ...state,
        ...action.payload
      }
    case actionTypes.PHOTOGROUP_REMOVE:
      return {
        ...state,
        photos: state.photos.filter(photo => photo._id !== action.payload._id)
      }
    default:
      return state
  }
}

export default groupReducer
