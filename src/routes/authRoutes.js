const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const storage = multer.diskStorage({});
const userController = require('../controllers/authController');
// Initialize multer middleware
const upload = multer({
  storage: storage,
  // limits:{fileSize:500000}
});

router.use(express.static('public'));
// router.post('/signup', upload.fields([{ name: 'images', maxCount: 4 }, { name: 'videoUrl', maxCount: 1 }]), userController.register);
router.post('/signup', userController.register);
router.post('/login', userController.login);
router.post('/updateUser/:id', userController.updateauthUser);
router.get('/allUsers/:id', userController.allUser);
router.get('/filterUsers/:id', userController.getFilterUser);
router.post('/addSkipUser/:id',userController.addSkipUser)
router.post('/addMatchUser/:id', userController.addMatchUser);
router.get('/getMatchUser/:id', userController.getMatchUser);
router.post('/addLikeSmsText/:id', userController.addLikeSmsTextUser);
router.post('/addLikeCount/:id', userController.addLikeCountUser);
router.get('/getLikeCount/:id', userController.getLikeCountUser);
router.post('/deleteLikeCount', userController.deleteCounterUser);
router.post('/addCommonVisitorLikeSkipUser/:id', userController.addCommonVisitorLikeSkipUser); // means frontend me likes me jo aaya usko skip karna 
router.get('/getCommonVisitorLikeSkipUser/:id', userController.getCommonVisitorLikeSkipUser);
router.post('/addLikeMatchUser/:id', userController.addLikeMatchUser);
router.get('/getLikeMatchUser/:id', userController.getLikeMatchUser);
router.post('/addOnlineSkipUser/:id', userController.addOnlineSkipUser);
router.post('/addOnlineLikeUser/:id', userController.addOnlineLikeUser);
router.get('/getOnlineLikeUser/:id', userController.getOnlineLikeUser);
router.post('/addVisitorUser/:id',userController.addVisitorUser)
router.get('/getVisitorUser/:id', userController.getVisitorUser);
router.post('/addVisitorCount/:id', userController.addVisitorCountUser);
router.get('/getVisitorCount/:id', userController.getVisitorCountUser);
router.post('/deleteVisitorCount', userController.deleteVisitorCounterUser);
router.post('/addVisitorSendEmail/:id', userController.addVisitorSendEmailUser);
router.post('/addVisitorLikeUser/:id', userController.addVisitorLikeUser);
router.get('/getVisitorLikeUser/:id', userController.getVisitorLikeUser);
module.exports = router;