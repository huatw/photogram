'use strict'

import React, {Component} from 'react'
import {withRouter, NavLink} from 'react-router-dom'
import {connect} from '../utils/RxHelper'
import {srcPath} from '../constants'

import {fetchFollowers$, toggleFollow$,} from '../actions/userFollowers'
import Loader from "./Loader"

@withRouter
@connect(
  ({session, user: {followers}}) => ({session, followers}),
  ({
    fetchFollowers: fetchFollowers$,
    toggleFollow: toggleFollow$
  })
)
class UserFollowers extends Component {
  componentDidMount () {
    const username = this.props.match.params.user
    this.props.fetchFollowers(username)
  }

  render () {
    const {
      followers,
      session,
      match,
      toggleFollow
    } = this.props
    const isLoggedin = session.username
    const isEmpty = followers.length === 0

    return followers.isLoading
      ? <Loader/>
      : isEmpty
        ? <div className="container has-text-centered animated shake">
          <h1 className="title is-1">No Follower</h1>
          <h2 className="subtitle is-3">Sad... No one knows.</h2>
        </div>
        : <div className="columns is-multiline is-variable is-1 animated bounceInUp">
          {
            followers.map(follower =>
              <div className="column is-half" key={follower.username}>
                <div className="level box">
                  <div className="level-item has-text-centered">
                    <div className="media">
                      <div className="media-left">
                        <figure className="image is-48x48">
                          <img src={`${srcPath}/img/${follower.thumbnail}`} alt="user thumbnail"/>
                        </figure>
                      </div>
                      <div className="media-content">
                        <strong>{follower.nickname}</strong>
                        <br/>
                        <NavLink activeClassName="selected"
                                 to={`/${follower.username}`}
                        >
                          @{follower.username}
                        </NavLink>
                      </div>
                    </div>
                  </div>
                  {isLoggedin && session.username !== follower.username && <div className="level-item has-text-centered">
                      <button className={`button is-link ${follower.isFollowing === null && 'is-loading'}`}
                              onClick={() => toggleFollow({
                                username: follower.username,
                                isFollowing: follower.isFollowing,
                                isOwner: session.username === match.params.user
                              })}
                      >
                        {follower.isFollowing ? 'unfollow': 'follow'}
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

export default UserFollowers
