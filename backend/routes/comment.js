const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middlewares/auth')

router.post('/', auth,  commentCtrl.createAComment)
router.get('/:id',  auth, commentCtrl.getAComment)
router.put('/:id',  auth,  commentCtrl.updateAComment);
router.get('/',  auth,commentCtrl.getAllComments);
router.delete('/:id', auth,  commentCtrl.deleteYourComment);

module.exports = router;