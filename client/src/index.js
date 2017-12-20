'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider, createState} from "./utils/RxHelper"

import './styles/style.css'
import reducer from "./reducers"
import action$ from "./actions"
import AppRouter from './routes'

const initialState = {
  notification: null,
  discover: {
    tags: [],
    photos: []
  },
  feed: {
    photos: []
  },
  session: {
    isLoading: true
  },
  modal: {
    isOpen: false,
    user: {
      username: '',
      nickname: '',
      password: ''
    }
  },
  user: {
    photos: [],
    groups: [],
    likes: [],
    followers: [],
    followees: [],
    profile: {isLoading: true}
  },
  photo: {
    isLoading: true,
    user: {}
  },
  group: {
    isLoading: true,
    user: {}
  }
}

ReactDOM.render(
  <Provider state$={createState(reducer, action$, initialState)}>
    <AppRouter/>
  </Provider>,
  document.querySelector('#root')
)