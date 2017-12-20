'use strict'

import React, {Component} from 'react'
import {Link, NavLink, withRouter} from 'react-router-dom'
import {connect} from '../utils/RxHelper'

import {open$} from '../actions/loginModal'
import {logout$} from '../actions/session'
import {uploadPhotos$} from '../actions/userPhotos'

@withRouter
@connect(
  ({session}) => ({session}),
  ({
    openModal: open$,
    logout: logout$,
    uploadPhotos: uploadPhotos$
  })
)
class NavBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isMobileBarOpen: false
    }
  }
  toggleMobileBar = () => {
    this.setState({isMobileBarOpen: !this.state.isMobileBarOpen})
  }
  render () {
    const {
      session,
      openModal,
      logout,
      uploadPhotos
    } = this.props

    const {
      username,
      nickname
    } = session

    const mobileBarStatus = this.state.isMobileBarOpen ? 'is-active' : ''
    const userInfo = username
      ?
        <div className="navbar-end">
          <span className="navbar-item">
            <div className="file">
              <label className="file-label">
                <input className="file-input" type="file" name="imgs" multiple
                       onChange={({target}) => {uploadPhotos({files: target.files, username})}}
                />
                <span className="file-cta button is-gray is-inverted">
                  <span className="file-icon">
                    <i className="ion-upload"></i>
                  </span>
                  <span className="file-label">
                    Upload
                  </span>
                </span>
              </label>
            </div>
          </span>
          <div className="navbar-item has-dropdown is-hoverable">
            <NavLink activeClassName="active-link"
                     className="navbar-item"
                     to={`/${username}`}
            >
              <span className="icon">
                <i className="ion-person ion-large-font"></i>
              </span>
              {nickname}
            </NavLink>
            <div className="navbar-dropdown">
              <NavLink className="navbar-item"
                       activeClassName="active-link"
                       exact
                       to={`/${username}`}
              >
                My Profile
              </NavLink>
              <NavLink className="navbar-item"
                       activeClassName="active-link"
                       to={`/${username}/photos`}
              >
                My Photos
              </NavLink>
              <NavLink className="navbar-item"
                       activeClassName="active-link"
                       to={`/${username}/groups`}
              >
                My Groups
              </NavLink>
              <hr className="navbar-divider"/>
              <a className="navbar-item"
                 onClick={logout}
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      :
        <div className="navbar-end">
          <span className="navbar-item">
            <button className="button is-gray is-inverted"
                  onClick={openModal}
            >
              Join Us
            </button>
          </span>
        </div>

    return (
      <header>
        <nav className="navbar has-shadow is-transparent is-fixed-top is-gray">
          <div className="container">
            <div className="navbar-brand">
              <NavLink className="navbar-item"
                       activeClassName="active-link"
                       to="/feed"
                       aria-label="home"
              >
                <i className="ion-image ion-large-font"></i>
              </NavLink>
              <div className={`navbar-burger burger ${mobileBarStatus}`}
                   onClick={this.toggleMobileBar}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className={`navbar-menu ${mobileBarStatus}`}>
              <div className="navbar-start">
                <NavLink activeClassName="active-link"
                         className="navbar-item is-tab"
                         exact
                         to="/"
                >
                  Home
                </NavLink>
                <NavLink activeClassName="active-link"
                         className="navbar-item is-tab"
                         to="/discover"
                >
                  Discover
                </NavLink>
                <NavLink activeClassName="active-link"
                         className="navbar-item is-tab"
                         to="/about"
                >
                  About us
                </NavLink>

              </div>
              {userInfo}
            </div>
          </div>
        </nav>
      </header>
    )
  }
}

export default NavBar
