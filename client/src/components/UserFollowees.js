'use strict'

import React, {Component} from 'react'
import {withRouter, NavLink, Link} from 'react-router-dom'
import {connect} from '../utils/RxHelper'
import {srcPath} from '../constants'

import {fetchFollowees$, toggleFollow$,} from '../actions/userFollowees'
import Loader from "./Loader"

@withRouter
@connect(
  ({session, user: {followees}}) => ({session, followees}),
  ({
    fetchFollowees: fetchFollowees$,
    toggleFollow: toggleFollow$
  })
)
class UserFollowees extends Component {
  componentDidMount () {
    const username = this.props.match.params.user
    this.props.fetchFollowees(username)
  }

  render () {
    const {
      followees,
      session,
      match,
      toggleFollow
    } = this.props
    const isLoggedin = session.username
    const isEmpty = followees.length === 0

    return followees.isLoading
      ? <Loader/>
      : isEmpty
        ? <div className="container has-text-centered animated shake">
          <h1 className="title is-1">No Following</h1>
          <h2 className="subtitle is-3">
            <Link to="/discover">
              Discover more user to follow.
            </Link>
          </h2>
        </div>
        : <div className="columns is-multiline is-variable is-1 animated bounceInUp">
          {
            followees.map(followee =>
              <div className="column is-half" key={followee.username}>
                <div className="level box">
                  <div className="level-item has-text-centered">
                    <div className="media">
                      <div className="media-left">
                        <figure className="image is-48x48">
                          <img src={`${srcPath}/img/${followee.thumbnail}`} alt="user thumbnail"/>
                        </figure>
                      </div>
                      <div className="media-content">
                        <strong>{followee.nickname}</strong>
                        <br/>
                        <NavLink activeClassName="selected"
                                 to={`/${followee.username}`}
                        >
                          @{followee.username}
                        </NavLink>
                      </div>
                    </div>
                  </div>
                  {isLoggedin && session.username !== followee.username && <div className="level-item has-text-centered">
                      <button className={`button is-link ${followee.isFollowing === null && 'is-loading'}`}
                              onClick={() => toggleFollow({
                                username: followee.username,
                                isFollowing: followee.isFollowing,
                                isOwner: session.username === match.params.user
                              })}
                      >
                        {followee.isFollowing ? 'unfollow': 'follow'}
                      </button>
                    </div>
                  }
                </div>
              </div>
            )
          }
        </div>
  }
}

export default UserFollowees
