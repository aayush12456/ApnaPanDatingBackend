const bcrypt=require('bcrypt')
const authUser=require('../models/authSchema')
const mongoose = require('mongoose');
const cloudinary = require("cloudinary").v2;
const twilio=require('twilio')
const nodemailer = require('nodemailer');
const ObjectId = mongoose.Types.ObjectId;
const dotenv=require('dotenv')
dotenv.config()
const client = twilio(process.env.TWILIO_SID,process.env. TWILIO_AUTH_TOKEN);
cloudinary.config({ 
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
  });

//   cloudinaryData.config({ 
//     cloud_name: process.env.SONG_CLOUD_NAME,
//     api_key: process.env.SONG_API_KEY,
//     api_secret: process.env.SONG_API_SECRET
//   });
exports.register = async (req, res) => {
    // const cloudImageUrls = [];
    // let cloudVideoUrl = '';

    // try {
    //     // Upload images to Cloudinary
    //     if (req.files.images) {
    //         for (const file of req.files.images) {
    //             const result = await cloudinary.uploader.upload(file.path, {
    //                 folder: 'uploadImages'
    //             });

    //             if (!result || !result.secure_url) {
    //                 throw new Error('Cloudinary image upload failed');
    //             }

    //             cloudImageUrls.push(result.secure_url);
    //         }
    //     }

    //     // Upload video to Cloudinary
       

    //     // if (req.file) {
            
    //     //         const  videoResult = await cloudinary.uploader.upload(req.file.path, {
    //     //             resource_type: 'video',
    //     //                   folder: 'uploadVideos'
    //     //         });
    //     //         console.log('video result is',videoResult)

    //     //         if (!videoResult|| ! videoResult.secure_url) {
    //     //             throw new Error('Cloudinary video upload failed');
    //     //         }

    //     //         cloudVideoUrl = videoResult.secure_url;
          
    //     // }
    //     if (req.files.videoUrl) {
    //         const videoFile = req.files.videoUrl[0];
    //         const videoResult = await cloudinary.uploader.upload(videoFile.path, {
    //             resource_type: 'video',
    //             folder: 'uploadVideos'
    //         });

    //         if (!videoResult || !videoResult.secure_url) {
    //             throw new Error('Cloudinary video upload failed');
    //         }

    //         cloudVideoUrl = videoResult.secure_url;
    //     }


    //     const UserData = new authUser({
    //         firstName: req.body.firstName,
    //         email: req.body.email,
    //         phone: req.body.phone,
    //         password: req.body.password,
    //         gender: req.body.gender,
    //         DOB: req.body.DOB,
    //         city: req.body.city,
    //         aboutUser: req.body.aboutUser,
    //         images: cloudImageUrls,
    //         videoUrl: cloudVideoUrl,
    //         interest: req.body.interest.split(','),
    //         education: req.body.education,
    //         drinking: req.body.drinking,
    //         smoking: req.body.smoking,
    //         eating: req.body.eating,
    //         profession: req.body.profession,
    //         looking: req.body.looking,
    //         relationship: req.body.relationship,
    //         zodiac: req.body.zodiac,
    //         language: req.body.language,
    //         songId:req.body.songId
    //     });

    //     const token = await UserData.generateAuthToken();
    //     const User = await UserData.save();
    //     // const loginDataObj = new loginIdUser({
    //     //     loginId: User._id.toString(),
    //     //     loginEmail: User.email
    //     //   });
    //     // existingLoginData=  await loginDataObj.save();
    //     res.status(201).send({ mssg: 'Data registered Successfully', user: User, token: token});
    // } catch (e) {
    //     console.error(e);
    //     res.status(401).send({ mssg: 'Data does not added' });
    // }
    res.status(201).send({ mssg: 'Data registered Successfully'});
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await authUser.findOne({ email: email });

    if (!userEmail) {
      res.status(400).send({ mssg: "Email does not exist", response: 400 });
      return;
    }

    const isMatch = await bcrypt.compare(password, userEmail.password);
    console.log('password login data', isMatch);

    if (isMatch) {
      const token = await userEmail.generateAuthToken();
      console.log('login token is', token);

      const data = await authUser.findOne({ email: email });

      // const existingLoginIdUser = await loginIdUser.findOne({ loginId: data._id });
      // let existingLoginData;

      // if (!existingLoginIdUser) {
      //   const loginDataObj = new loginIdUser({
      //     loginId: data._id.toString(),
      //     loginEmail: data.email
      //   });
      // existingLoginData=  await loginDataObj.save();
      // } else {
      //   console.log('User is already logged in on another device.');
      //   existingLoginData = existingLoginIdUser;
      // }
      res.status(201).send({
        mssg: 'Login Successfully',
        response: 201,
        loginData: { name:data.firstName,image:data.images[0],gender:data.gender,_id:userEmail._id },
        token: token,
        userId: userEmail._id,
        completeLoginData:data
        // existingLoginData: existingLoginData
      });
    } else {
      res.status(400).send({ mssg: "Wrong password", response: 400 });
    }
  } catch (e) {
    res.status(400).send({ mssg: "Wrong login details. Please try again.", response: 400 });
  }
};

exports.updateauthUser=async(req,res)=>{ // function to update user
  try{
      const _id=req.params.id
      console.log('body is',req.body)
      console.log(_id)
      const updateUser=await authUser.findByIdAndUpdate(_id,req.body,{
          new:true
      })
      res.status(201).send({mssg:'update data successfully',updateData:updateUser})
      console.log('update is',updateUser)
  }catch(e){
      res.status(404).send({mssg:'internal server error'})
  }
}


exports.allUser = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await authUser.findById(userId);

      // Check if the user exists
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const city = user.city;
      const gender = user.gender;
      // const visitors = user.visitors.map(visitor => visitor.visitorId.toString()); // Assuming visitors is an array of ObjectIds
      // const likes = user.likes.map(like => like.toString());
      // const onlineSkipUser=user.onlineSkipUser.map(onlineSkip=>onlineSkip.toString())
      // const onlineLikeUser=user.onlineLikeUser.map(onlineLike=>onlineLike.toString())
      // const deactivatedUser=user.deactivatedIdArray.map(deactivateUser=>deactivateUser.toString())
      const users = await authUser.find();

      // Filter out users with the same city and opposite gender
      let filteredUsers = users.filter(u => u.city !== city);

      if (gender === 'Male') {
          filteredUsers = filteredUsers.filter(u => u.gender === 'Female');
      } else {
          filteredUsers = filteredUsers.filter(u => u.gender === 'Male');
      }

      // Remove users from filteredUsers if they are present in the visitors array
      // filteredUsers = filteredUsers.filter(u => !visitors.includes(u._id.toString()));
      // filteredUsers = filteredUsers.filter(u => !likes.includes(u._id.toString()));
      // filteredUsers = filteredUsers.filter(u => !onlineSkipUser.includes(u._id.toString()));
      // filteredUsers = filteredUsers.filter(u => !onlineLikeUser.includes(u._id.toString()));
      // filteredUsers = filteredUsers.filter(u => ! deactivatedUser.includes(u._id.toString()));
      res.json({
          users: filteredUsers
      });
  } catch (error) {
      res.status(500).json({ message: "Internal server error" });
  }
}


exports.getFilterUser = async (req, res) => {
  try {
      const userId = req.params.id; // Assuming the user ID is passed as a parameter in the URL
      console.log('get filter data', userId); // login user id

      // Find the user with the specified ID
      const user = await authUser.findById(userId);
      console.log('user is data', user);

      if (!user) {
          return res.status(404).json({ mssg: "User not found" });
      }

      const filterUserArray = user.filterData;
      console.log('filter user array ', filterUserArray);

      const matchFilterUserArray = user.matchUser;
      console.log('like filter user array', matchFilterUserArray);

      const anotherMatchFilterUserArray = user.anotherMatchUser;
      console.log('like filter user array', anotherMatchFilterUserArray);

      const userInterests = user.interest; // Get interests of the user
      const userGender = user.gender;
      const userCity = user.city; // Get city of the user
      console.log('gender is', userGender);
      console.log('city is', userCity);

      // const hideRemainMatchArray = user.hideRemainMatch;
      // console.log('hide remain match array', hideRemainMatchArray);

      // Fetch the full user objects for the IDs in hideRemainMatchArray
      // const hideRemainMatchUsers = await authUser.find({
      //     _id: { $in: hideRemainMatchArray }
      // });
      // console.log('hide remain match users', hideRemainMatchUsers);

      let interestUsers;
      
      if (userGender === 'Male') {
          // Find females with at least one similar interest, matching city, and not in filterUserArray or likeFilterUserArray
          interestUsers = await authUser.find({ 
              gender: 'Female', 
              interest: { $in: userInterests },
              city: userCity,
              // _id: { $nin: [...filterUserArray, ...likeFilterUserArray] }
              _id: { $nin: [...filterUserArray,...matchFilterUserArray,...anotherMatchFilterUserArray] }
          });
      } else if (userGender === 'Female') {
          // Find males with at least one similar interest, matching city, and not in filterUserArray or likeFilterUserArray
          interestUsers = await authUser.find({ 
              gender: 'Male', 
              interest: { $in: userInterests },
              city: userCity,
              // _id: { $nin: [...filterUserArray, ...likeFilterUserArray] }
              _id: { $nin: [...filterUserArray,...matchFilterUserArray,...anotherMatchFilterUserArray] }
          });
      } else {
          return res.status(400).json({ mssg: "Invalid gender" });
      }

      if (!interestUsers || interestUsers.length === 0) {
          return res.status(404).json({ mssg: "No users found with matching interest and city" });
      }

      // Filter out users from interestUsers who are in hideRemainMatchUsers
      // const hideRemainMatchUserIds = hideRemainMatchUsers.map(user => user._id.toString());
      // interestUsers = interestUsers.filter(user => !hideRemainMatchUserIds.includes(user._id.toString()));

      res.json({ interestUsers });
      console.log('interest user is', interestUsers);
  } catch (error) {
      res.status(500).json({ mssg: "Internal server error" });
  }
};

exports.addSkipUser = async (req, res) => { // if you want to unlike user that unlike user id store in a database with the help of these func
  try {
      const userId = req.params.id; // login person  userId
      console.log('user id is', userId);

      // Fetch the user object based on the provided userId
      const userObj = await authUser.findById(userId);
      if (!userObj) {
          return res.status(404).json({ mssg: "User not found" });
      }

      const addUserId = req.body.userId; // unlike person user id
      console.log('add id is', addUserId);

      // Update the user object to add the new ID to the filterData array
      userObj.filterData.push(addUserId); // Assuming filterData is an array in your User model

      // Save the updated user object
      const updatedUser = await userObj.save();

      res.json({ user: updatedUser,crossUserId:addUserId });
  } catch (error) {
      console.error(error);
      res.status(500).json({ mssg: "Internal server error" });
  }
};

exports.addMatchUser = async (req, res) => {
  try {
      const matchLikeId = req.body.matchLikeId; // like user id
      const loginId = req.params.id; // login user id
      console.log(matchLikeId, 'matchPlusLike', loginId);
      const userObj = await authUser.findById(loginId);
      const anotherUserObj = await authUser.findById(matchLikeId);
      // const matchUserObj = await authUser.findById(matchLikeId);
      console.log('user obj data is',userObj)
      console.log('another user obj data is',anotherUserObj)

      if (!userObj && !anotherUserObj) {
          return res.status(404).json({ mssg: "User not found" });
      }

      // if (anotherUserObj.visitors.includes(loginId)) {
      //     anotherUserObj.counter = (anotherUserObj.counter || 0) + 1;
      // }
      // const index = anotherUserObj. likeUser.indexOf(loginId);
      // if (index > -1) {
      //     anotherUserObj. likeUser.splice(index, 1);
      // }
      // // Check if loginId is present in anotherUserObj.likes
      // if (!anotherUserObj.likes.includes(loginId)) {
      //     anotherUserObj.anotherMatchData.push(loginId);
      // }

      userObj.matchUser.push(matchLikeId);
      anotherUserObj.anotherMatchUser.push(loginId);
      // matchUserObj.matchNotify = loginId;

      const matchLikeUser = await userObj.save();
      const anotherMatchLikeUser = await anotherUserObj.save();
      // const matchUser = await matchUserObj.save();

      console.log('match person like', matchLikeUser);
      // console.log('match User', matchUser);
      let matchUser;
      matchUser = await authUser.find({  
          _id: { $in: matchLikeUser.matchUser }, 
          
      });
      
      let anotherMatchUser;
      anotherMatchUser=await authUser.find({
          _id: { $in:anotherMatchLikeUser.anotherMatchUser }
      })
      res.json({
          matchUser:matchUser,
          anotherMatchUser: anotherMatchUser,
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ mssg: "Internal server error" });
  }
};

exports.getMatchUser=async(req,res)=>{ // function to get data of like user
    try{
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        console.log('get match user is',user)
        const getMatchUserArray=user.matchUser
        const anothergetMatchUserArray=user.anotherMatchUser
        console.log(' get match data is',getMatchUserArray)
        // const anothergetMatchUserData=user.anotherMatchData
        // const obj=await authUser.findById(user.matchNotify)

        // const deactivateUserArray=user.deactivatedIdArray
        // const blockUserArray=user.blockUserArray 
        // const oppositeBlockUserArray=user.oppositeBlockUserArray
        
        let matchUser;
        matchUser = await authUser.find({  
            _id: { $in: getMatchUserArray }, 
            
        });
        // matchUser = matchUser.filter(matchItem => !blockUserArray.includes(matchItem._id.toString()));
        // matchUser = matchUser.filter(matchItem => !oppositeBlockUserArray.includes(matchItem._id.toString()));
        let anotherMatchUser;
        anotherMatchUser=await authUser.find({
            _id: { $in:anothergetMatchUserArray }
        })
        // anotherMatchUser = anotherMatchUser.filter(anotherMatchItem => !blockUserArray.includes(anotherMatchItem._id.toString()));
        // anotherMatchUser = anotherMatchUser.filter(anotherMatchItem => !oppositeBlockUserArray.includes(anotherMatchItem._id.toString()));
        // let anotherMatchUserData;
        // anotherMatchUserData=await authUser.find({
        //     _id: { $in:anothergetMatchUserData }
        // })
       

        res.json({matchUser: matchUser,anotherMatchUser:anotherMatchUser });
        // setTimeout(async () => {
        //     user.matchNotify = null; // Clear the notification
        //     await user.save(); // Save the changes
        //   }, 5000);
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}
exports.addLikeSmsTextUser = async (req, res) => {
    try {
        const smsUserId = req.body.matchLikeId; // like user id
        const senderUserId = req.params.id; // login user id
        console.log(smsUserId, 'sms id', senderUserId);

        const userObj = await authUser.findById(smsUserId);
        console.log('sms user obj is', userObj);

        const likeUserObj = await authUser.findById(senderUserId);

        if (!userObj.phone) {
            throw new Error('User phone number is missing');
        }

        await client.messages.create({
            body: `Congrats! ${likeUserObj.firstName} just liked you now on ApnaPan checkout your likes`, // Your message here
            // aayushtapadia28@gmail.co or aayushtapadia2001@gmail.com generated twillo phone number
            // from: '+12513335644', // Your Twilio phone number
            from: '+12513103964', // Your Twilio phone number
            to: '+91'+userObj.phone.toString() // Phone number of likeUserObj
        });

        res.status(200).json({ mssg: "Message sent successfully" });

    } catch (error) {
        console.error('Error sending SMS:', error);
        if (error.code === 21408) {
            res.status(400).json({ mssg: "Permission to send an SMS has not been enabled for the region indicated by the 'To' number" });
        } else {
            res.status(500).json({ mssg: "Internal server error" });
        }
    }
};

exports.addLikeCountUser = async (req, res) => {
    try {
      const id = req.params.id;
      const userId=req.body.matchLikeId
      const userObj = await authUser.findById(userId);
      // console.log('user data obj',userObj)
      if (userObj) {
        userObj.counter = userObj.counter ? userObj.counter + 1 : 1; // Incrementing the counter value
        await userObj.save(); // Saving the updated userObj
      //   io.emit('new counter', { userId: userId, counter: userObj.counter });
        console.log('Updated userObj:', userObj);
        res.status(200).send({ message: 'Counter incremented successfully', userObj:userObj });
      } 
   
      else {
        
        res.status(404).send({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };

  exports.getLikeCountUser=async(req,res)=>{
    try{
        const userId = req.params.id; 
        const user = await authUser.findById(userId);
        console.log('get count user is',user.counter)
        res.json({userObj:user });
     
    } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

exports.deleteCounterUser = async (req, res) => {
    try {
        const userId = req.body.loginId;
        const user = await authUser.findById(userId);
        console.log('user id in count',userId)
        
        if (user) {
            // Delete the counter property from the user object
            user.counter = null; // or delete user.counter;

            // Save the updated user object
            await user.save();
           
            console.log('Counter deleted for user:', user);
            const io = req.app.locals.io;
            io.emit('deleteLikeCount', user.counter);
         
            res.status(200).send({ message: 'Counter deleted successfully', userObj:user });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};