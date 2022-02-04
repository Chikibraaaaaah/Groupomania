const express = require('express');
const multer = require('../middlewares/multer-config');
const router = express.Router();
const publiCtrl = require('../controllers/publication');
const auth = require('../middlewares/auth')

router.post('/',  auth,  multer,   publiCtrl.createOnePublication);
router.put('/:id',auth, multer,  publiCtrl.updateYourPublication);
router.delete('/:id',auth,  publiCtrl.deleteYourPublication);
router.get('/:id',auth,  publiCtrl.getOnePublication);
router.get('/',auth,publiCtrl.getAllPublications);

module.exports = router;