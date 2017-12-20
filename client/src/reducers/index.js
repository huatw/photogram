'use strict'

import {combineReducers} from '../utils/RxHelper'

import discoverReducer from './discover'
import feedReducer from './feed'
import sessionReducer from './session'
import modalReducer from './loginModal'
import photoReducer from './photo'
import groupReducer from './group'
import userReducer from './user'
import notificationReducer from './notification'


const reducer = combineReducers({
  notification: notificationReducer,
  discover: discoverReducer,
  feed: feedReducer,
  session: sessionReducer,
  modal: modalReducer,
  photo: photoReducer,
  group: groupReducer,
  user: userReducer
})

export default reducer
