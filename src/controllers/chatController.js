const ChatUser=require('../models/chatSchema')
const chatIdUser=require('../models/chatIdSchema')
const moment = require('moment-timezone');
exports.addChat = async (req, res) => {
    try {
      const { id, anotherId, loginName, anotherName } = req.body;
  
      // Fetch all existing chat records
      const chatIdArray = await chatIdUser.find();
  
      const existingChat = chatIdArray.find(
        (item) =>
          (item.loginId === id && item.anotherId === anotherId) ||
          (item.loginId === anotherId && item.anotherId === id)
      );
  
      if (existingChat) {
        // If a matching chat is found, send it in the response
        return res.status(200).send({
          mssg: 'Chat already exists',
          chatUser: existingChat,
        });
      }
      // If no matching chat is found, create and save the new chat
      const chat = new chatIdUser({
        loginId: id,
        anotherId: anotherId,
        loginName: loginName,
        anotherName: anotherName,
      });
  
      await chat.save();
      res.status(201).send({ mssg: 'Chat Data added Successfully', chatUser: chat });
    } catch (e) {
      console.error(e);
      res.status(500).send({ mssg: 'message does not exist' });
    }
  };

  exports.getChat = async (req, res) => {
    try {
      const id = req.query.loginId;
      const anotherId = req.query.anotherId;
      console.log('id in get chat',id)
      console.log('another id in get chat',anotherId)
  
      const chatIdArray = await chatIdUser.find();
      console.log('chat id array', chatIdArray);
  
      let found = false;
  
      for (let i = 0; i < chatIdArray.length; i++) {
        if (
          (chatIdArray[i].loginId === id && chatIdArray[i].anotherId === anotherId) || 
          (chatIdArray[i].loginId === anotherId && chatIdArray[i].anotherId === id)
        ) {
          res.status(201).send({ mssg: 'Chat id data fetched successfully', chatIdUser: chatIdArray[i] });
          found = true;
          break; // Exit the loop after sending the response
        }
      }
  
      if (!found) {
        res.status(404).send({ mssg: 'No matching chat found' });
      }
  
    } catch (e) {
      console.error(e);
      res.status(500).send({ mssg: 'An error occurred while fetching chat data' });
    }
  }

  exports.addSendMessage = async (req, res) => {
    try {
      const { id: loginId } = req.params;
      const { senderId, recieverId, message,senderName,images } = req.body;
  
      // Fetch the chatIdArray
      const chatIdArray = await chatIdUser.find();
  
      // Find an existing chat where the sender and receiver match the given IDs
      const existingChat = chatIdArray.find(chat =>
        (chat.loginId === loginId && chat.anotherId === recieverId) ||
        (chat.loginId === recieverId && chat.anotherId === loginId)
      );
      const indianTime = moment().tz('Asia/Kolkata').toISOString();
      // Create a new ChatUser object
      const chatData = new ChatUser({
        loginId,
        senderId,
        recieverId,
        message,
        chatId: existingChat ? existingChat._id : undefined, // Assign chatId if a matching chat was found
        timestamp: indianTime 
      });
  
      // Save the new chat data
      const chat = await chatData.save();
      // const recieverObj = await authUser.findById(recieverId);

      // if (recieverObj) {
      //   // Push the new notification
      //   recieverObj.messageNotify.push({ loginId: loginId, senderId:senderId,recieverId:recieverId, message:message, chatId:existingChat ? existingChat._id : undefined, timestamp: indianTime,senderName:senderName,images:images });
      //   recieverObj.recordChat.push({ loginId: loginId, senderId:senderId,recieverId:recieverId, message:message, chatId:existingChat ? existingChat._id : undefined, timestamp: indianTime });
      //   recieverObj.postTyping=null
      //   // Save the updated receiver object
      //   await recieverObj.save();
      //   console.log("Notification added successfully");
      // } else {
      //   console.log("Receiver not found");
      // }
      // Respond with success
      res.status(201).send({ mssg: 'Chat data added successfully', chatUser: chat,
      // senderUser:{ loginId: loginId, senderId:senderId,recieverId:recieverId, message:message, chatId:existingChat ? existingChat._id : undefined, timestamp: indianTime,senderName:senderName,images:images },
      // recordChat:{ loginId: loginId, senderId:senderId,recieverId:recieverId, message:message, chatId:existingChat ? existingChat._id : undefined, timestamp: indianTime,senderName:senderName,images:images }
     })

    } catch (e) {
      console.error(e);
      res.status(500).send({ mssg: 'Message does not exist' });
    }
  };

  exports.getSendMessage=async(req,res)=>{
    try{
        const id=req.params.id
      //   const fiveMinutesAgo = moment().subtract(5, 'minutes').toDate();
      // await ChatUser.deleteMany({ timestamp: { $lt: fiveMinutesAgo } });
      // console.log('Old messages deleted successfully');
        const allChatArray=await ChatUser.find()
        console.log('login chat data obj',allChatArray)
        let filterChatArray
        filterChatArray=allChatArray.filter((item)=>item.loginId===id || item.recieverId===id)
        // let recieverChatArray
        // recieverChatArray=allChatArray.filter((item)=>item.recieverId===id)
        res.status(201).send({ mssg: 'get chat Array', chatUserArray:filterChatArray });
    
    }catch(e){
        console.error(e)
        
        res.status(500).send({mssg:'message does not exist'})
    }
    }
    exports.deleteChat=async(req,res)=>{
      try{
     const chatId=req.body.chatId
     const message=req.body.message
     const time=req.body.timestamp
     const deleteFindChatObj=await ChatUser.findOne({chatId:chatId,message:message,timestamp:time})
     const deleteChatObj=await ChatUser.findByIdAndDelete(deleteFindChatObj._id)
     const io = req.app.locals.io;
     io.emit('messageDeleted', deleteChatObj);
  
    res.status(200).json({ msg: "User deleted successfully" ,deleteChat:deleteChatObj,time:time});
  
      }catch(e){
        console.error(e);
        res.status(500).send({ mssg: 'An error occurred while fetching chat data' });
      }
    }
    exports.getAllChatId = async (req, res) => {
      try {
     const AllChatIdArray=await chatIdUser.find()
     res.status(200).send({mssg:'all chats fetch succesfully',chatIdArray:AllChatIdArray
    })
    
      } catch (e) {
        console.error(e);
        res.status(500).send({ mssg: 'An error occurred while fetching chat data' });
      }
    }