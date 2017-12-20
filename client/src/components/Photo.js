'use strict'

import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from '../utils/RxHelper'
import {checkAlphanumeric, checkLength} from '../utils/inputChecker'
import {srcPath} from '../constants'

import {fetch$, update$, toggleShare$, toggleLike$,} from '../actions/photo'
import {inputMsg$} from '../actions/notification'

import Loader from "./Loader"

@withRouter
@connect(
  ({session, photo}) => ({session, photo}),
  ({
    fetchPhoto: fetch$,
    updatePhoto: update$,
    toggleShare: toggleShare$,
    toggleLike: toggleLike$,
    inputMsg: inputMsg$
  })
)
class Photo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false
    }
  }

  componentDidMount () {
    const pid = this.props.match.params.photo
    this.props.fetchPhoto(pid)
  }

  componentWillReceiveProps (nextProps) {
    const sessionChange = this.props.session !== nextProps.session
    if (sessionChange) {
      const pid = this.props.match.params.photo
      this.props.fetchPhoto(pid)
    }

    const justEdit = this.props.photo.isshared === null
      && this.props.photo.isshared !== nextProps.photo.isshared
    if (this.state.isEditing === true && justEdit) {
      this.setState({isEditing: false})
    }
  }

  confirmEdit = () => {
    const pid = this.props.photo._id
    const title = this.title.value.trim()
    if (!checkAlphanumeric(title)) {
      this.props.inputMsg('Title is illegal.')
      return
    }
    if (checkLength(title)) {
      this.props.inputMsg('Title is too long.')
      return
    }
    const tagStr = this.tags.value.trim()
    const tags = tagStr.length === 0 ? []: tagStr.split(/\s+/)
    const description = this.description.value.trim()
    this.props.updatePhoto({pid, tags, title, description})
  }

  toggleEdit = () => {
    this.setState({isEditing: !this.state.isEditing})
  }

  toggleLike = () => {
    const {_id: pid, isLiked} = this.props.photo
    this.props.toggleLike({pid, isLiked})
  }

  render () {
    const {
      photo,
      session,
      toggleShare,
      toggleLike
    } = this.props

    const createtime = new Date(photo.createtime).toLocaleString()
    photo.user = photo.user || {}
    photo.tags = photo.tags || []
    const isLoading = photo.isshared === null ? 'is-loading': ''
    const isLogin = session.username
    const isOwner = session.username === photo.user.username

    const Modal = (
      <div className="modal is-active animated bounceInDown">
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
                    <label htmlFor="photo-title-input"></label>
                    <input className="input"
                           id="photo-title-input"
                           autoFocus
                           type="text"
                           name="title"
                           placeholder="Title"
                           defaultValue={photo.title}
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
                    <label htmlFor="photo-description-input"></label>
                    <input className="input"
                           id="photo-description-input"
                           autoFocus
                           type="text"
                           name="description"
                           placeholder="Description"
                           defaultValue={photo.description}
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
              <div className="field-label">
                  <label className="label">Tags</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control has-icon">
                    <label htmlFor="photo-tags-input"></label>
                    <input className="input"
                           id="photo-tags-input"
                           autoFocus
                           type="text"
                           name="tags"
                           placeholder="Tags(split with whitespace)"
                           defaultValue={photo.tags.join(' ')}
                           ref={(input) => this.tags = input}
                    />
                    <span className="icon is-small">
                      <i className="ion-pound" aria-hidden="true"></i>
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

    return photo.isLoading
      ? <Loader/>
      : <div>
        {this.state.isEditing && Modal}
        <div className="columns is-variable is-2">
          <div className="column is-two-thirds animated bounceInUp">
            <img src={`${srcPath}/img/${photo.storedname}`} alt="photo"/>
          </div>
          <div className="column animated pulse">
            <div className="box">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                    <img src={`${srcPath}/img/${photo.user.thumbnail}`}
                         alt="user thumbnail"
                    />
                  </figure>
                </div>
                <div className="media-content">
                  <div className="title is-4">{photo.user.nickname}</div>
                  <div className="subtitle is-6">
                    <Link to={`/${photo.user.username}`}>
                      @{photo.user.username}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="box content">
              <nav className="columns is-mobile">
                <div className="column is-half">
                  <strong>
                    {photo.title}
                  </strong>
                </div>
                <div className="column">
                  {isOwner &&
                    <button className={`button is-link is-small ${isLoading}`}
                            onClick={() => toggleShare({pid: photo._id, isshared: !photo.isshared})}
                    >
                      {photo.isshared ? 'unshare': 'share'}
                    </button>
                  }
                </div>
                <div className="column">
                  {isOwner &&
                    <button className={`button is-link is-small`}
                            onClick={this.toggleEdit}
                    >
                      Edit
                    </button>
                  }
                </div>
                {isLogin && !isOwner &&
                  <div className="column">
                    <a onClick={this.toggleLike}>
                      <span className="icon">
                        <i className={photo.isLiked ? `ion-ios-heart` : `ion-ios-heart-outline`}></i>
                      </span>
                    </a>
                  </div>
                }
              </nav>
              <p>
                {photo.description || "No Description."}
                <br/>
                {
                  photo.tags.map(tag =>
                    <Link key={tag} to={`/discover/${tag}`}>
                      #{tag}
                    </Link>
                  )
                }
                <br/>
                Posted @
                <time dateTime={createtime}>{createtime}</time>
              </p>
            </div>
          </div>
        </div>
      </div>
  }
}

export default Photo
