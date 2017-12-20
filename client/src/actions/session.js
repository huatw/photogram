'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

import {inputMsg$} from './notification'

function fetchSession () {
  return get('/api/session')
}

function login ({username, password}) {
  return post('/api/session', {username, password})
    .do(res => {
      if (res.status >= 400) {
        inputMsg$.next(res.message)
      }
    })
}

function logout () {
  return del('/api/session')
    .do(() => history.push('/'))
}

function register ({username, password, nickname}) {
  return post(`/api/users`, {username, password, nickname})
    .do(res => {
      if (res.status >= 400) {
        inputMsg$.next('Register failed.')
      }
    })
}

function update ({username, password, nickname}) {
  return put(`/api/users`, {username, password, nickname})
    .map(state => ({...state, isLoading: false}))
}

const fetch$ = createAction()
const fetchAction$ = mergeLoader(fetch$, fetchSession, {isFetching: true}).map(payload => ({
  payload,
  type: actionTypes.SESSION_FETCH
}))

const login$ = createAction()
const loginAction$ = mergeLoader(login$, login).map(payload => ({
  payload,
  type: actionTypes.SESSION_LOGIN
}))

const logout$ = createAction()
const logoutAction$ = mergeLoader(logout$, logout).map(payload => ({
  payload,
  type: actionTypes.SESSION_LOGOUT
}))

const register$ = createAction()
const registerAction$ = mergeLoader(register$, register).map(payload => ({
  payload,
  type: actionTypes.SESSION_REGISTER
}))

const update$ = createAction()
const updateAction$ = mergeLoader(update$, update).map(payload => ({
  payload,
  type: actionTypes.SESSION_UPDATE
}))

export {
  fetch$,
  login$,
  logout$,
  register$,
  update$
}

export default [
  fetchAction$,
  loginAction$,
  logoutAction$,
  registerAction$,
  updateAction$
]
