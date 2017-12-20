'use strict'

const router = require('express').Router()
const {groups, photos} = require('../controllers')
const {requireLogin, requirePhotoAuth, requireGroupAuth} = require('../middlewares/authorization')
const uploadImg = require('../middlewares/multer')

router
  .param('group', groups.load)
  .get('/:group', requireLogin, requireGroupAuth, groups.fetch) // fetch profile
  .delete('/:group', requireLogin, requireGroupAuth, groups.remove) //remove group, remove group-photo relation
  .put('/:group', requireLogin, requireGroupAuth, groups.update) // update group profile
  .post('/:group/thumbnail', requireLogin, requireGroupAuth, uploadImg.single('thumbnail'), groups.updateThumbnail)

router
  .post('/', requireLogin, groups.create)
  .get('/', requireLogin, groups.fetchByUser) // fetch one's all group
  //.put('/', requireLogin, groups.removeList) // remove some group
  // need to requirePhotoAuth all the list item

// photo-group
router
  .param('photo', photos.load)
  .get('/photos/:photo', requireLogin, requirePhotoAuth, groups.fetchGroupByPhoto)
  .post('/:group/photos/:photo', requireLogin, requireGroupAuth, requirePhotoAuth, groups.addPhoto) // add pic to group
  .delete('/:group/photos/:photo', requireLogin, requireGroupAuth, requirePhotoAuth, groups.removePhoto) // remove pic from group

module.exports = router
