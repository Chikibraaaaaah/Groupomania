const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')

router.get('/:id', auth,  userCtrl.getUserProfile);
router.get('/', auth,  userCtrl.getAllProfiles);
router.delete('/:id', auth, userCtrl.deleteAcccount);
router.put('/:id', auth, multer, userCtrl.updateYourAccount);


module.exports = router;
