'use strict'

import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from '../utils/RxHelper'
import {fetch$} from '../actions/feed'
import {srcPath} from '../constants'

import Loader from "./Loader"

@connect(
  ({session, feed: {photos}}) => ({session, photos}),
  ({fetchFeed: fetch$})
)
class Feed extends Component {
  componentDidMount () {
    if (this.props.session.username) {
      this.props.fetchFeed()
    }
  }

  componentWillMount () {
    this.checkLoggedin(this.props.session)
  }

  componentWillReceiveProps (nextProps) {
    this.checkLoggedin(nextProps.session)
  }

  checkLoggedin = (session) => {
    const isLoggedin = session.username
    if (!isLoggedin) {
      this.props.history.push('/')
    }
  }

  render () {
    const {
      photos,
    } = this.props

    const isEmpty = photos.length === 0

    return photos.isLoading
      ? <Loader/>
      : isEmpty
        ? <div className="container has-text-centered animated shake">
          <h1 className="title is-1">Empty Feed</h1>
          <h2 className="subtitle is-3">Upload and share your photos.</h2>
        </div>
        : <div className="columns is-multiline is-variable is-1 animated bounceInUp">
          {
            photos.map(photo =>
              <div className="column is-one-third" key={photo._id}>
                <div className="card">
                  <Link className="card-image"
                        to={`/photos/${photo._id}`}
                  >
                    <figure className="image is-4by3">
                      <img src={`${srcPath}/img/${photo.storedname}`} alt="user photo"/>
                    </figure>
                  </Link>
                  <div className="card-content has-text-centered">
                    <p>
                      <strong>{photo.title}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )
          }
        </div>
  }
}

export default Feed
