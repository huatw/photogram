'use strict'

import React, {Component} from 'react'
import {connect} from '../utils/RxHelper'

import {open$} from '../actions/loginModal'

@connect(
  ({session}) => ({session}),
  ({
    openModal: open$
  })
)
class Home extends Component {
  componentWillMount () {
    this.checkLoggedin(this.props.session)
  }

  componentWillReceiveProps (nextProps) {
    this.checkLoggedin(nextProps.session)
  }

  checkLoggedin (session) {
    const isLoggedin = session.username
    if (isLoggedin) {
      this.props.history.push('/feed')
    }
  }

  render () {
    const {
      openModal
    } = this.props

    return (
      <div className="container has-text-centered animated zoomIn">
        <h1 className="title is-1">Photogram</h1>
        <h2 className="subtitle is-3">Share and manage your photos.</h2>
        <button className="button is-link is-medium"
                onClick={openModal}
        >
          Join Us
        </button>
      </div>
    )
  }
}

export default Home
