'use strict'

import {combineReducers} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function notificationReducer (state, action) {
  switch (action.type) {
    case actionTypes.NOTIFICATION_CLOSE:
      return null
    case actionTypes.NOTIFICATION_INPUT:
      return action.payload
    default:
      return state
  }
}

export default notificationReducer
