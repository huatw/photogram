'use strict'

import Rx from 'rxjs'

import discoverActions$ from './discover'
import feedActions$ from './feed'
import sessionActions$ from './session'
import loginModalActions$ from './loginModal'
import photoActions$ from './photo'
import groupActions$ from './group'
import userProfileActions$ from './userProfile'
import userPhotosActions$ from './userPhotos'
import userGroupsActions$ from './userGroups'
import userLikesActions$ from './userLikes'
import userFollowersActions$ from './userFollowers'
import userFolloweesActions$ from './userFollowees'
import notificationActions$ from './notification'

export default Rx.Observable.merge(
  ...discoverActions$,
  ...feedActions$,
  ...sessionActions$,
  ...loginModalActions$,
  ...photoActions$,
  ...groupActions$,
  ...userProfileActions$,
  ...userPhotosActions$,
  ...userGroupsActions$,
  ...userLikesActions$,
  ...userFollowersActions$,
  ...userFolloweesActions$,
  ...notificationActions$
)