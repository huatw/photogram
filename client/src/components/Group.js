'use strict'

import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from '../utils/RxHelper'
import {checkAlphanumeric, checkLength} from '../utils/inputChecker'

import {srcPath} from '../constants'

import {fetch$, update$, removePhotoGroup$, updateThumbnail$} from '../actions/group'
import {inputMsg$} from '../actions/notification'

import Loader from "./Loader"

@withRouter
@connect(
  ({session, group}) => ({session, group}),
  ({
    fetchGroup: fetch$,
    updateGroup: update$,
    inputMsg: inputMsg$,
    removePhotoGroup: removePhotoGroup$,
    updateThumbnail: updateThumbnail$
  })
)
class Group extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false
    }
  }

  componentDidMount () {
    const group = this.props.match.params.group
    this.props.fetchGroup(group)
  }

  componentWillReceiveProps (nextProps) {
    const justEdit = this.props.group.updatetime === null
      && this.props.group.updatetime !== nextProps.group.updatetime
    if (this.state.isEditing === true && justEdit) {
      this.setState({isEditing: false})
    }
  }

  toggleEdit = () => {
    this.setState({isEditing: !this.state.isEditing})
  }

  confirmEdit = () => {
    const gid = this.props.group._id
    const title = this.title.value.trim()
    if (!checkAlphanumeric(title)) {
      this.props.inputMsg('Title is illegal.')
      return
    }
    if (checkLength(title)) {
      this.props.inputMsg('Title is too long.')
      return
    }
    const description = this.description.value.trim()
    this.props.updateGroup({gid, title, description})
  }

  render () {
    const {
      group,
      session,
      removePhotoGroup,
      updateThumbnail
    } = this.props

    const photos = group.photos || []
    const isLoading = group.updatetime === null ? 'is-loading': ''
    const updatetime = new Date(group.updatetime).toLocaleString()

    const isEmpty = photos.length === 0
    const Photos = isEmpty
      ? <div className="has-text-centered animated shake">
        <h1 className="title is-1">Empty Group</h1>
        <h2 className="subtitle is-3">
          <Link to={`/${session.username}/photos`}>
            Let's add some photos.
          </Link>
        </h2>
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
                <div className="card-content has-text-centered">
                  <p>
                    <strong>{photo.title}</strong>
                  </p>
                </div>
              </div>
              <button className="delete is-medium"
                      onClick={() => removePhotoGroup({
                        pid: photo._id,
                        gid: group._id
                      })}
              >
                delete
              </button>
            </div>
          )
        }
      </div>

    const Modal = (
      <div className="modal is-active animated bounceInDown ">
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="box">
            <h1 className="title">Edit Photo</h1>
            <div className="field is-horizontal">
              <div className="field-label">
                  <label className="label">Title</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control has-icon">
                    <label htmlFor="group-title-input"></label>
                    <input className="input"
                           id="group-title-input"
                           autoFocus
                           type="text"
                           name="title"
                           placeholder="Title"
                           defaultValue={group.title}
                           ref={(input) => this.title = input}
                    />
                    <span className="icon is-small">
                      <i className="ion-quote" aria-hidden="true"></i>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-label">
                  <label className="label">Description</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control has-icon">
                    <label htmlFor="group-description-input"></label>
                    <input className="input"
                           id="group-description-input"
                           autoFocus
                           type="text"
                           name="description"
                           placeholder="Description"
                           defaultValue={group.description}
                           ref={(input) => this.description = input}
                    />
                    <span className="icon is-small">
                      <i className="ion-document-text" aria-hidden="true"></i>
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
                    <button className={`button is-link ${isLoading}`}
                            onClick={() => this.confirmEdit()}
                    >
                      Edit
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="modal-close is-large"
                aria-label="close"
                onClick={this.toggleEdit}
        >
        </button>
      </div>
    )

    return group.isLoading
      ? <Loader/>
      : <div>
        {this.state.isEditing && Modal}
        <div className="columns">
          <div className="column is-two-thirds animated bounceInUp">
            {Photos}
          </div>
          <div className="column animated pulse">
            <div className="box">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                    <img src={`${srcPath}/img/${session.thumbnail}`}
                         alt="user thumbnail"
                    />
                  </figure>
                </div>
                <div className="media-content">
                  <div className="title is-4">{session.nickname}</div>
                  <div className="subtitle is-6">
                    <Link to={`/${session.username}`}>
                      @{session.username}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="box">
              <div className="columns is-mobile">
                <div className="column is-two-thirds">
                  <div className="media">
                    <div className="media-left">
                      <div className="file">
                        <label className="file-label">
                          <input className="file-input" type="file" name="thumbnail"
                                 onChange={({target}) => updateThumbnail({
                                   file: target.files[0],
                                   gid: group._id
                                 })}
                          />
                          <figure className="image is-48x48">
                            <img src={`${srcPath}/img/${group.thumbnail}`}
                                 alt="user thumbnail"
                            />
                          </figure>
                        </label>
                      </div>
                    </div>
                    <div className="media-content">
                      <strong>{group.title}</strong>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <button className={`button is-link is-small`}
                          onClick={this.toggleEdit}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <p>
                {group.description || "No Description."}
                <br/>
                Updated @
                <time dateTime={updatetime}>{updatetime}</time>
              </p>
            </div>
          </div>
        </div>
      </div>
  }
}

export default Group
