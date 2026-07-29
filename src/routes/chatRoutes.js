const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({});
const chatController = require('../controllers/chatController');

const upload = multer({
    storage: storage,
    // limits:{fileSize:500000}
  });
  
  router.use(express.static('public'));  
router.post('/addSendMessage/:id',  upload.single("image"), chatController.addSendMessage);
router.get('/getMessage/:id', chatController.getSendMessage);
router.post('/addChatId',chatController.addChat)
router.get('/getChatId',chatController.getChat)
// router.post('/showIndicator',chatController.showIndicator)
router.post('/deleteChat',chatController.deleteChat)
// // router.post('/askWithChatExpert',chatController.chatWithExpert)
router.get('/getAllChatId',chatController.getAllChatId)
router.post('/postTyping/:id',chatController.postTyping)
router.get('/getTyping/:id',chatController.getTyping)
router.post('/deleteTyping',chatController.deleteTyping)
router.post('/addRecordMessage/:id', chatController.addRecordMessage);
router.get('/getRecordMessage/:id',chatController.getRecordMessage)
router.post('/deleteRecordMessage/:id',chatController.deleteRecordMessage)
router.post('/addAnotherRecordMessage/:id',chatController.addAnotherRecordMessage)
router.post('/deleteAnotherRecordMessage/:id',chatController.deleteAnotherRecordMessage)
module.exports=router