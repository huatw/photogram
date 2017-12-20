'use strict'

import React, {Component} from 'react'
import {connect} from '../utils/RxHelper'

import {close$} from '../actions/notification'

@connect(
  ({notification}) => ({notification}),
  ({closeNotification: close$})
)
class Notification extends Component {
  componentDidMount() {
    const {closeNotification} = this.props
    setTimeout(
      closeNotification,
      2500,
    )
  }

  render () {
    const {
      notification,
      closeNotification
    } = this.props

    return (
      <div className="message-notification message is-link animated shake">
        <div className="message-header">
          <p>Message:</p>
          <button className="delete"
                  aria-label="delete"
                  onClick={closeNotification}
          >
          </button>
        </div>
        <div className="message-body">
          {notification}
        </div>
      </div>
    )
  }
}

export default Notification
