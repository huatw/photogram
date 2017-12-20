'use strict'

import React, {Component} from 'react'
import {NavLink, Link} from 'react-router-dom'
import {connect} from '../utils/RxHelper'
import {srcPath} from '../constants'

import {fetch$, fetchByTag$, fetchTags$, autoSearch$} from '../actions/discover'

import Loader from "./Loader"

@connect(
  ({discover: {tags, photos}}) => ({tags, photos}),
  ({
    fetchDiscover: fetch$,
    fetchDiscoverByTag: fetchByTag$,
    fetchTags: fetchTags$,
    autoSearchDiscover: autoSearch$
  })
)
class Discover extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFocus: false
    }
  }
  toggleLoad = () => {
    this.setState({
      isFocus: !this.state.isFocus
    })
  }

  componentDidMount () {
    this.props.fetchTags()
    this.fetchPhotos(this.props.match.params.tag)
  }

  componentWillReceiveProps (nextProps) {
    const oldTagName = this.props.match.params.tag
    const tagName = nextProps.match.params.tag
    if (tagName !== oldTagName) {
      this.fetchPhotos(tagName)
    }
  }

  fetchPhotos = (tagName) => {
    if (tagName) {
      this.props.fetchDiscoverByTag(tagName)
    }
    else {
      this.props.fetchDiscover()
    }
  }

  render () {
    const {
      tags,
      photos,
      match,
      autoSearchDiscover
    } = this.props

    const Tags = !tags.isLoading
      && <div className="tags">
        {
          tags.map(tagName =>
            <div className="box tag is-rounded is-medium is-white"
                 key={tagName}
            >
              <NavLink to={`/discover/${tagName}`}
                       activeClassName="selected"
              >
                #{tagName}
              </NavLink>
            </div>
          )
        }
      </div>

    const isEmpty = photos.length === 0
    const Photos = !photos.isLoading && (isEmpty
      ? <div className="container has-text-centered animated shake">
        <h1 className="title is-1">Empty Discover</h1>
        <h2 className="subtitle is-3">No shared photo yet.</h2>
      </div>
      : <div className="columns is-multiline is-variable is-1 animated bounceInUp">
        {
          photos.map(photo =>
            <div className="column is-one-third"
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
            </div>
          )
        }
      </div>)

    return (
      <div>
        {(tags.isLoading || photos.isLoading) && <Loader/>}
        <div className="animated pulse">
          {Tags}
          <div className="searchbar field has-text-centered">
            <p className={`control has-icons-left has-icons-right ${this.state.isFocus && 'is-loading'}`}>
              <label htmlFor="searchbar-input"></label>
              <input id="searchbar-input" className="input" type="text" placeholder="Search..."
                     onFocus={this.toggleLoad}
                     onBlur={this.toggleLoad}
                     onKeyUp={autoSearchDiscover}
              />
              <span className="icon is-small is-left">
                <i className="ion-search ion-large-font"></i>
              </span>
            </p>
          </div>
        </div>
        <hr/>
        {Photos}
      </div>
    )
  }
}

export default Discover
