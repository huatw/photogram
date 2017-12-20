'use strict'

import {combineReducers} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function isOpenReducer (state = false, action) {
  switch (action.type) {
    case actionTypes.MODAL_OPEN:
      return true
    case actionTypes.MODAL_CLOSE:
      return false
    default:
      return state
  }
}

function inputReducer (
  state = {username: '', nickname: '', password: ''},
  action
) {
  switch (action.type) {
    case actionTypes.MODAL_INPUT:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

const loginModalReducer = combineReducers({
  isOpen: isOpenReducer,
  user: inputReducer
})

export default loginModalReducer
