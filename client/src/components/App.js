'use strict'

import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from '../utils/RxHelper'

import {fetch$} from '../actions/session'
import NavBar from './NavBar'
import LoginModal from './LoginModal'
import Notification from './Notification'
import Loader from './Loader'

@withRouter
@connect(
  ({session, notification}) => ({session, notification}),
  ({fetchSession: fetch$})
)
class App extends Component {
  componentDidMount() {
    this.props.fetchSession()
  }

  render () {
    const {
      session,
      notification,
      children
    } = this.props

    return session.isFetching
      ? <Loader/>
      : (
        <div className="container section">
          <LoginModal/>
          {notification && <Notification/>}
          <NavBar/>
          {children}
        </div>
      )
  }
}

export default App
