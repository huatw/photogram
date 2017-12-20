'use strict'

import React, {Component} from 'react'
import {connect} from '../utils/RxHelper'
import {checkAlphanumeric, checkLength} from '../utils/inputChecker'

import {close$, input$} from '../actions/loginModal'
import {login$, register$, update$} from '../actions/session'
import {inputMsg$} from '../actions/notification'

@connect(
  ({modal, session}) => ({modal, session}),
  ({
    closeModal: close$,
    input: input$,
    login: login$,
    register: register$,
    updateProfile: update$,
    inputMsg: inputMsg$
  })
)
class LoginModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isRegister: false
    }
  }

  toggleMode = () => {
    this.setState({isRegister: !this.state.isRegister})
  }

  checkLogin = ({username, password}) => {
    if (!checkAlphanumeric(username)) {
      this.props.inputMsg('Username is illegal.')
      return
    }
    if (password.length === 0) {
      this.props.inputMsg('Password cannot be empty.')
      return
    }
    this.props.login({username, password})
  }

  checkUpdate = ({username, nickname, password}) => {
    if (!checkAlphanumeric(username)) {
      this.props.inputMsg('Username is illegal.')
      return
    }
    if (!checkAlphanumeric(nickname)) {
      this.props.inputMsg('Nickname is illegal.')
      return
    }
    if (checkLength(nickname)) {
      this.props.inputMsg('Nickname is too long.')
      return
    }
    if (password.length < 6) {
      this.props.inputMsg('Password is too short.')
      return
    }
    if (password.length === 0) {
      this.props.inputMsg('Password cannot be empty.')
      return
    }
    this.props.updateProfile({username, nickname, password})
  }

  checkRegister = ({username, nickname, password}) => {
    if (!checkAlphanumeric(username)) {
      this.props.inputMsg('Username is illegal.')
      return
    }
    if (!checkAlphanumeric(nickname)) {
      this.props.inputMsg('Nickname is illegal.')
      return
    }
    if (checkLength(username)) {
      this.props.inputMsg('Username is too long.')
      return
    }
    if (checkLength(nickname)) {
      this.props.inputMsg('Nickname is too long.')
      return
    }
    if (password.length < 6) {
      this.props.inputMsg('Password is too short.')
      return
    }
    if (password.length === 0) {
      this.props.inputMsg('Password cannot be empty.')
      return
    }
    this.props.register({username, nickname, password})
  }

  componentWillReceiveProps (nextProps) {
    this.checkLoggedin(nextProps.session)
  }

  checkLoggedin (session) {
    const justLoggedin = session.username && !this.props.session.username
    const justEdit = session.isLoading === false
      && this.props.session.isLoading === true
    if (this.props.modal.isOpen && (justLoggedin || justEdit)) {
      this.props.closeModal()
    }
  }

  render () {
    const {
      modal,
      session,
      closeModal,
      input,
    } = this.props

    const isLoading = session.isLoading ? 'is-loading' : ''

    let Title, Nickname, Button, Info
    let {username, password = '', nickname} = modal.user

    const isLoggedin = session.username
    if (isLoggedin) {
      username = session.username
      Title = 'Edit'
      Info = (
        <div className="control">
          Click to update profile.
        </div>
      )
      Button = (
        <button className={`button is-link ${isLoading}`}
                onClick={() => this.checkUpdate({username, nickname, password})}
        >
          Edit
        </button>
      )
      Nickname = true
    }
    else {
      if (this.state.isRegister) {
        Title = 'Register'
        Button = (
          <button className={`button is-link ${isLoading}`}
                  onClick={() => this.checkRegister({username, password, nickname})}
          >
            Register
          </button>
        )
        Info = (
          <div className="control">
            Already have an account?
            <a onClick={this.toggleMode}> Click to log in.</a>
          </div>
        )
        Nickname = true
      }
      else {
        Title = 'Log in'
        Info = (
          <div className="control">
            Don't have an account?
            <a onClick={this.toggleMode}> Click to register.</a>
          </div>
        )
        Button = (
          <button className={`button is-link ${isLoading}`}
                  onClick={() => this.checkLogin({username, password})}
          >
            Log in
          </button>
        )
      }
    }

    return (
      <div className={`animated bounceInDown modal ${modal.isOpen ? 'is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="box">
            <h1 className="title">{Title}</h1>
            <div className="field is-horizontal">
              <div className="field-label">
                  <label className="label">Username</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control has-icon">
                    <label htmlFor="username-input"></label>
                    <input className="input"
                           id="username-input"
                           autoFocus
                           type="text"
                           name="username"
                           placeholder="Username"
                           value={username}
                           onChange={({target}) => input({username: target.value})}
                    />
                    <span className="icon is-small">
                      <i className="ion-person" aria-hidden="true"></i>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {Nickname
              && <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">Nickname</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control has-icon">
                      <label htmlFor="nickname-input"></label>
                      <input className="input"
                             id="nickname-input"
                             type="text"
                             name="nickname"
                             placeholder="Nickname"
                             value={nickname}
                             onChange={({target}) => input({nickname: target.value})}
                      />
                      <span className="icon is-small">
                        <i className="ion-bowtie" aria-hidden="true"></i>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            }
            <div className="field is-horizontal">
              <div className="field-label">
                  <label className="label">Password</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control has-icon">
                    <label htmlFor="password-input"></label>
                    <input className="input"
                           id="password-input"
                           type="password"
                           name="password"
                           placeholder="Password"
                           value={password}
                           onChange={({target}) => input({password: target.value})}
                    />
                    <span className="icon is-small">
                      <i className="ion-locked" aria-hidden="true"></i>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-label"></div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    {Button}
                  </p>
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-label"></div>
              <div className="field-body">
                <div className="field">
                  {Info}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="modal-close is-large"
                aria-label="close"
                onClick={closeModal}
        >
        </button>
      </div>
    )
  }
}

export default LoginModal
