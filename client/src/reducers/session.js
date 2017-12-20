'use strict'

import {combineReducers} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function sessionReducer (state, action) {
  switch (action.type) {
    case actionTypes.SESSION_REGISTER:
    case actionTypes.SESSION_FETCH:
    case actionTypes.SESSION_LOGIN:
      return action.payload
    case actionTypes.SESSION_LOGOUT:
      return {}
    case actionTypes.SESSION_UPDATE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export default sessionReducer
