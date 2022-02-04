const express = require('express')
const router = express.Router();
const notificationCtrl = require('../controllers/notification')
const auth = require('../middlewares/auth')

router.get('/', auth, notificationCtrl.getNotifications)

module.exports = router;