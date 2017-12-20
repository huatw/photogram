'use strict'

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Rx from 'rxjs'

const mergeLoader = (action$, ajax, loaderState = {isLoading: true}) =>
  Rx.Observable.merge(
    action$.mapTo(loaderState),
    action$.mergeMap(ajax)
  )

const createAction = () => new Rx.Subject()

const createState = (reducer, action$, initialState) =>
  action$
    .startWith(initialState)
    .scan(reducer)
    .publishReplay(1)
    .refCount()

const combineReducers = (reducerO) =>
  (state = {}, action) =>
    Object.keys(reducerO).reduce(
      (nextState, key) => ({
        ...nextState,
        [key]:  reducerO[key](state[key], action)
      }),
      {}
    )

function connect (selector = state => state, actionSubjects = {}) {
  const actions = Object.keys(actionSubjects)
    .reduce(
      (acc, key) => ({ ...acc, [key]: arg => actionSubjects[key].next(arg)}),
      {}
    )

  return (WrappedComponent) =>
    class Connect extends Component {
      static contextTypes = {
        state$: PropTypes.object.isRequired
      }

      componentWillMount () {
        this.subscription = this.context.state$
          .map(selector)
          .subscribe((state) => this.setState(state))
      }

      componentWillUnmount () {
        this.subscription.unsubscribe()
      }

      render() {
        return (
          <WrappedComponent {...this.state} {...this.props} {...actions}/>
        )
      }
    }
}

class Provider extends Component {
  static propTypes = {
    state$: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    state$: PropTypes.object.isRequired,
  }

  getChildContext() {
    return { state$: this.props.state$ }
  }

  render() {
    return this.props.children
  }
}

export {
  mergeLoader,
  createAction,
  createState,
  combineReducers,
  connect,
  Provider
}