'use strict'

import React from 'react'
import {Route, Switch, Router} from 'react-router-dom'
import history from '../utils/RxHttp'

import Discover from '../components/Discover'
import App from '../components/App'
import NotFound from '../components/NotFound'
import About from '../components/About'
import Feed from '../components/Feed'
import Home from '../components/Home'
import User from '../components/User'
import Photo from '../components/Photo'
import Group from '../components/Group'

const AppRouter = () => (
  <Router history={history}>
    <App>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/404" component={NotFound}/>
        <Route exact path="/about" component={About}/>
        <Route exact path="/discover/:tag?" component={Discover}/>
        <Route exact path="/feed" component={Feed}/>
        <Route exact path="/photos/:photo" component={Photo}/>
        <Route exact path="/groups/:group" component={Group}/>
        <Route path="/:user" component={User}/>
      </Switch>
    </App>
  </Router>
)

export default AppRouter
