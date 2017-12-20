'use strict'

import Rx from 'rxjs'
import history, {get, post, put, del} from '../utils/RxHttp'
import {createAction, mergeLoader} from '../utils/RxHelper'
import * as actionTypes from '../constants/actionTypes'

function fetchGroups () {
  return get(`/api/groups`)
    .do(groups => {
      // unauthed
      if (!Array.isArray(groups)) {
        history.push('/404')
      }
    })
}

function createGroup ({title}) {
  return post(`/api/groups`, {title})
}

function removeGroup (gid) {
  return del(`/api/groups/${gid}`)
}

const fetchGroups$ = createAction()
const fetchGroupsAction$ = mergeLoader(fetchGroups$, fetchGroups).map(payload => ({
  payload,
  type: actionTypes.USER_GROUPS_FETCH
}))

const createGroup$ = createAction()
const createGroupAction$ = createGroup$.mergeMap(createGroup).map(payload => ({
  payload,
  type: actionTypes.USER_GROUPS_CREATE
}))

const removeGroup$ = createAction()
const removeGroupAction$ = removeGroup$.mergeMap(removeGroup).map(payload => ({
  payload,
  type: actionTypes.USER_GROUPS_REMOVE
}))

export {
  fetchGroups$,
  createGroup$,
  removeGroup$,
}

export default [
  fetchGroupsAction$,
  createGroupAction$,
  removeGroupAction$,
]
