'use strict'

import React, {Component} from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from '../utils/RxHelper'
import {srcPath} from '../constants'

import {fetchProfile$, toggleFollow$, updateThumbnail$} from '../actions/userProfile'
import {open$} from '../actions/loginModal'

import Loader from "./Loader"

@withRouter
@connect(
  ({session, user: {profile}}) => ({session, profile}),
  ({
    fetchProfile: fetchProfile$,
    openModal: open$,
    toggleFollow: toggleFollow$,
    updateThumbnail: updateThumbnail$
  })
)
class UserProfile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const oldUserName = this.props.match.params.user
    const userName = nextProps.match.params.user
    const userChange = userName !== oldUserName
    const sessionChange = this.props.session !== nextProps.session

    if (userChange || sessionChange) {
      this.props.fetchProfile(userName)
    }
  }

  componentDidMount () {
    const username = this.props.match.params.user
    this.props.fetchProfile(username)
  }

  render () {
    const {
      profile,
      session,
      match,
      openModal,
      toggleFollow,
      updateThumbnail
    } = this.props

    const isOwner = session.username === match.params.user
    const isLoggedin = !isOwner && session.username
    const isLoading = profile.isFollowing === null ? 'is-loading' : ''

    return profile.isLoading
      ? <Loader/>
      : <div className="box animated pulse">
        <nav className="level">
          <div className="level-item has-text-centered">
            <div className="media">
              <div className="media-left">
                {isOwner
                  ? <div className="file">
                    <label className="file-label">
                      <input className="file-input" type="file" name="thumbnail"
                             onChange={({target}) => {updateThumbnail(target.files[0])}}
                      />
                      <figure className="image is-48x48">
                        <img src={`${srcPath}/img/${profile.thumbnail}`}
                             alt="user thumbnail"
                        />
                      </figure>
                    </label>
                  </div>
                  : <figure className="image is-48x48">
                    <img src={`${srcPath}/img/${profile.thumbnail}`}
                         alt="user thumbnail"
                    />
                  </figure>
                }
              </div>
              <div className="media-content">
                <strong>{profile.nickname}</strong>
                <br/>
                <NavLink activeClassName="selected"
                         to={`/${profile.username}`}
                >
                  @{profile.username}
                </NavLink>
              </div>
            </div>
          </div>
          {isOwner && <div className="level-item has-text-centered">
              <button className={`button is-link`}
                      onClick={openModal}
              >
                Edit
              </button>
            </div>
          }
          {isLoggedin && <div className="level-item has-text-centered">
              <button className={`button is-link ${isLoading}`}
                      onClick={() => toggleFollow({
                        username: match.params.user,
                        isFollowing: profile.isFollowing}
                      )}
              >
                {profile.isFollowing ? 'unfollow': 'follow'}
              </button>
            </div>
          }
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Photos</p>
              <p className="title">
                <NavLink activeClassName="selected"
                         aria-label="photo-number"
                         to={`${match.url}/photos`}
                >
                  {profile.nPhotos}
                </NavLink>
              </p>
            </div>
          </div>
          {isOwner &&
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Groups</p>
                <p className="title">
                  <NavLink activeClassName="selected"
                           aria-label="group-number"
                           to={`${match.url}/groups`}
                  >
                    {profile.nGroups}
                  </NavLink>
                </p>
              </div>
            </div>
          }
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Following</p>
              <p className="title">
                <NavLink activeClassName="selected"
                         aria-label="following-number"
                         to={`${match.url}/followees`}
                >
                  {profile.nFollowees}
                </NavLink>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Followers</p>
              <p className="title">
                <NavLink activeClassName="selected"
                         aria-label="follower-number"
                         to={`${match.url}/followers`}
                >
                  {profile.nFollowers}
                </NavLink>
              </p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Likes</p>
              <p className="title">
                <NavLink activeClassName="selected"
                         aria-label="like-photo-number"
                         to={`${match.url}/likes`}
                >
                  {profile.nLikes}
                </NavLink>
              </p>
            </div>
          </div>
        </nav>
      </div>
  }
}

export default UserProfile
