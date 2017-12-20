'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'


const close$ = createAction()
const closeAction$ = close$.map(payload => ({
  payload,
  type: actionTypes.MODAL_CLOSE
}))

const open$ = createAction()
const openAction$ = open$.map(payload => ({
  payload,
  type: actionTypes.MODAL_OPEN
}))

const input$ = createAction()
const inputAction$ = input$.map(payload => ({
  payload,
  type: actionTypes.MODAL_INPUT
}))

export {
  close$,
  open$,
  input$
}

export default [
  closeAction$,
  openAction$,
  inputAction$
]


