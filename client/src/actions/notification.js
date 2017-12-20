'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

const close$ = createAction()
const closeAction$ = close$
.throttleTime(2500)
.mapTo({
  type: actionTypes.NOTIFICATION_CLOSE
})

const inputMsg$ = createAction()
const inputMsgAction$ = inputMsg$
.map(payload => ({
  payload,
  type: actionTypes.NOTIFICATION_INPUT
}))

export {
  close$,
  inputMsg$
}

export default [
  closeAction$,
  inputMsgAction$
]


