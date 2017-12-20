'use strict'

import Rx from 'rxjs'
import createHistory from 'history/createBrowserHistory'
import {srcPath} from '../constants'

const transError = e => Rx.Observable.of({
  status: e.status,
  message: e.response.message
})
const transRes = ({response}) => response

const get = url => Rx.Observable.ajax({
  withCredentials: true,
  crossDomain: true,
  method: 'GET',
  url: `${srcPath}${url}`
}).map(transRes).catch(transError)

const post = (url, body) => Rx.Observable.ajax({
  withCredentials: true,
  crossDomain: true,
  method: 'POST',
  body,
  url: `${srcPath}${url}`
}).map(transRes).catch(transError)

const put = (url, body) => Rx.Observable.ajax({
  withCredentials: true,
  crossDomain: true,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
  url: `${srcPath}${url}`
}).map(transRes).catch(transError)

const del = url => Rx.Observable.ajax({
  withCredentials: true,
  crossDomain: true,
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  url: `${srcPath}${url}`
}).map(transRes).catch(transError)

export {
  get,
  post,
  put,
  del,
}

export default createHistory()
