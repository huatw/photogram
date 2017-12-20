'use strict'

import React, {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import {connect} from '../utils/RxHelper'
import {srcPath} from '../constants'

import {fetchPhotos$, removePhoto$} from '../actions/userPhotos'
import {fetchGroups$} from '../actions/userGroups'
import {addPhotoGroup$} from '../actions/group'

import Loader from "./Loader"

@withRouter
@connect(
  ({session, user: {photos}}) => ({session, photos}),
  ({
    fetchPhotos: fetchPhotos$,
    fetchGroups: fetchGroups$,
    removePhoto: removePhoto$
  })
)
class UserPhotos extends Component {
  componentDidMount () {
    const username = this.props.match.params.user
    this.props.fetchPhotos(username)
    if (username === this.props.session.username) {
      this.props.fetchGroups()
    }
  }
  componentWillReceiveProps (nextProps) {
    const oldUserName = this.props.match.params.user
    const userName = nextProps.match.params.user
    const userChange = userName !== oldUserName
    const sessionChange = this.props.session !== nextProps.session

    if (userChange || sessionChange) {
      this.props.fetchPhotos(userName)
    }
  }

  render () {
    const {
      photos,
      session,
      match,
      removePhoto
    } = this.props
    const isOwner = session.username === match.params.user

    const isEmpty = photos.length === 0

    return photos.isLoading
      ? <Loader/>
      : isEmpty
        ? <div className="container has-text-centered animated shake">
          <h1 className="title is-1">No Photo</h1>
          <h2 className="subtitle is-3">Upload some photos first.</h2>
        </div>
        : <div className="columns is-multiline is-variable is-1 animated bounceInUp">
          {
            photos.map(photo =>
              <div className="column is-one-third notification"
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
                  <div className="columns is-mobile card-content has-text-centered">
                    <div className={`column ${isOwner && 'is-half'}`}>
                      <strong>{photo.title}</strong>
                    </div>
                    {isOwner &&
                      <div className="column">
                        <a className="button is-link is-small"
                           aria-label="download-photo"
                           href={`${srcPath}/img/${photo.storedname}`}
                           download
                        >
                          <span className="icon">
                            <i className="ion-large-font ion-code-download" aria-hidden="true"></i>
                          </span>
                        </a>
                      </div>
                    }
                    {isOwner &&
                      <div className="column">
                        <GroupDropdown pid={photo._id}/>
                      </div>
                    }
                  </div>
                </div>
                {isOwner &&
                  <button className="delete is-medium"
                          onClick={() => removePhoto(photo._id)}
                  >
                    delete
                  </button>
                }
              </div>
            )
          }
        </div>
  }
}

@connect(
  ({user: {groups}}) => ({groups}),
  ({
    addPhotoGroup: addPhotoGroup$,
  })
)
class GroupDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isGrouping: false
    }
  }

  grouping = () => {
    this.setState({isGrouping: !this.state.isGrouping})
  }
  addPhotoGroup = (gid) => {
    const pid = this.props.pid
    this.props.addPhotoGroup({pid, gid})
  }

  render () {
    const {
      groups
    } = this.props

    return (
      <div className={`dropdown ${this.state.isGrouping && 'is-active'}`}>
        <div className="dropdown-trigger">
          <button className="button is-link is-small" aria-haspopup="true" aria-controls="dropdown-menu"
                  onClick={this.grouping}
          >
            <span>Group+</span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {
              !groups.isLoading && groups.map(g =>
                <a className="dropdown-item"
                   key={g._id}
                   onClick={() => {
                      this.grouping()
                      this.addPhotoGroup(g._id)
                   }}
                >
                  {g.title}
                </a>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

export default UserPhotos
