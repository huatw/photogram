'use strict'

import React, {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import {connect} from '../utils/RxHelper'
import {srcPath} from '../constants'

import {fetchGroups$, removeGroup$, createGroup$} from '../actions/userGroups'
import {inputMsg$} from '../actions/notification'

import Loader from "./Loader"

@withRouter
@connect(
  ({session, user: {groups}}) => ({session, groups}),
  ({
    fetchGroups: fetchGroups$,
    removeGroup: removeGroup$,
    createGroup: createGroup$,
    inputMsg: inputMsg$
  })
)
class UserGroups extends Component {
  componentDidMount () {
    const username = this.props.match.params.user
    if (username === this.props.session.username) {
      this.props.fetchGroups()
    }
  }

  checkCreateGroup = () => {
    const title = this.title.value.trim()
    if (title.length > 15) {
      this.props.inputMsg('Title is too long.')
      return
    }
    if (title.length === 0) {
      this.props.inputMsg('Title cannot be empty.')
      return
    }
    this.props.createGroup({title})
  }

  render () {
    const {
      groups,
      session,
      match,
      removeGroup
    } = this.props
    const isOwner = session.username === match.params.user

    return groups.isLoading
      ? <Loader/>
      : <div className="columns is-multiline is-variable is-1 animated bounceInUp">
        <div className="column is-one-third">
          <div className="box">
            <div className="field has-addons">
              <div className="control has-icons-left">
                <label htmlFor="group-create-input"></label>
                <input className="input is-medium"
                       id="group-create-input"
                       type="text"
                       name="title"
                       placeholder="Title"
                       ref={(input) => this.title = input}
                />
                <span className="icon is-left">
                  <i className="ion-quote" aria-hidden="true"></i>
                </span>
              </div>
              <div className="control">
                <button className={`button is-link is-medium ${"isLoading"}`}
                        onClick={() => this.checkCreateGroup()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        {
          groups.map(group =>
            <div className="column is-one-third notification animated zoomIn" key={group._id}>
              {isOwner && <button className="delete is-medium"
                                  onClick={() => removeGroup(group._id)}
                >delete
                </button>
              }
              <div className="media box">
                <div className="media-left">
                  <Link to={`/groups/${group._id}`}>
                    <figure className="image is-48x48">
                      <img src={`${srcPath}/img/${group.thumbnail}`} alt="group thumbnail"/>
                    </figure>
                  </Link>
                </div>
                <div className="media-content">
                  <strong>{group.title}</strong>
                  <br/>
                  {group.description}
                </div>
              </div>
            </div>
          )
        }
      </div>
  }
}

export default UserGroups
