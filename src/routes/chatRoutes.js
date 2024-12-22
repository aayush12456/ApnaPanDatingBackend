const path = require('path');
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
router.post('/addSendMessage/:id', chatController.addSendMessage);
router.get('/getMessage/:id', chatController.getSendMessage);
router.post('/addChatId',chatController.addChat)
router.get('/getChatId',chatController.getChat)
// router.post('/showIndicator',chatController.showIndicator)
router.post('/deleteChat',chatController.deleteChat)
// // router.post('/askWithChatExpert',chatController.chatWithExpert)
router.get('/getAllChatId',chatController.getAllChatId)
// router.post('/postTyping',chatController.postTyping)
// router.get('/getTyping/:id',chatController.getTyping)
module.exports=router