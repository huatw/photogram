'use strict'

import React, {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import {connect} from '../utils/RxHelper'
import {srcPath} from '../constants'

import {fetchLikes$} from '../actions/userLikes'
import Loader from "./Loader"

@withRouter
@connect(
  ({user: {likes}}) => ({likes}),
  ({fetchLikes: fetchLikes$})
)
class UserLikes extends Component {
  componentDidMount () {
    const username = this.props.match.params.user
    this.props.fetchLikes(username)
  }

  render () {
    const {likes} = this.props
    const isEmpty = likes.length === 0

    return likes.isLoading
      ? <Loader/>
      : isEmpty
        ? <div className="container has-text-centered animated shake">
          <h1 className="title is-1">No Photo</h1>
          <h2 className="subtitle is-3">
            <Link to="/discover">
              Discover some photos.
            </Link>
          </h2>
        </div>
        : <div className="columns is-multiline is-variable is-1 animated bounceInUp">
          {
            likes.map(photo => // min width
              <div className="column is-one-third"
                    key={photo._id}
              >
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

export default UserLikes
