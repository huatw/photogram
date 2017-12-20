'use strict'

const path = require('path')
const multer = require('multer')
const {imgPath} = require('../config')

const storage = multer.diskStorage({
  destination: imgPath,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`)
  }
})

const uploadImg = multer({
  storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    const isImg = file.mimetype.startsWith('image/')
    if (isImg) {
      return cb(null, true)
    }
    const e = Error('File type error.')
    e.status = 403
    return cb(e)
  }
})

// const FILE_TYPES = /jpeg|jpg|png|gif/
// const extname = FILE_TYPES.test(
//   path.extname(file.originalname).toLowerCase()
// )
// const mimetype = FILE_TYPES.test(file.mimetype)

// if (extname && mimetype) {
//   return cb(null, true)
// }

module.exports = uploadImg