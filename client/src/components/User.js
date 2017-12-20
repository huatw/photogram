'use strict'

import React, {Component} from 'react'
import {Route, Redirect, Switch, Link} from 'react-router-dom'
import {connect} from '../utils/RxHelper'

import UserProfile from './UserProfile'
import UserLikes from './UserLikes'
import UserFollowees from './UserFollowees'
import UserFollowers from './UserFollowers'
import UserPhotos from './UserPhotos'
import UserGroups from './UserGroups'

@connect(
  ({session}) => ({session})
)
class User extends Component {
  render () {
    const {
      session,
      match
    } = this.props

    const isOwner = session.username === match.params.user

    return (
      <div>
        <UserProfile/>
        <hr/>
        <Switch>
          <Route exact path={`/:user/likes`} component={UserLikes}/>
          <Route exact path={`/:user/followees`} component={UserFollowees}/>
          <Route exact path={`/:user/followers`} component={UserFollowers}/>
          <Route exact path={`/:user/photos`} component={UserPhotos}/>
          {(session.isLoading || isOwner) && <Route exact path={`/:user/groups`} component={UserGroups}/>}
          <Redirect from={`/:user/**`} to="/404"/>
        </Switch>
      </div>
    )
  }
}

export default User
