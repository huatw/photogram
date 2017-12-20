'use strict'

const path = require('path')

const config = {
  dbpath: 'mongodb://localhost:27017/photogram',
  publicPath: path.join(__dirname, '../../client/dist'),
  imgPath: path.join(__dirname, '../../client/dist/img'),
  thumbnailStr: 'default_user_thumbnail.png',
  groupcoverStr: 'default_group_thumbnail.png',
  serverPort: 3000,
  saltRounds: 10
}

module.exports = config