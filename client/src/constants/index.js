'use strict'

const isDev = process.env.NODE_ENV === 'DEV'
const srcPath = isDev ? 'http://localhost:3000': ''

export {
  srcPath,
}
