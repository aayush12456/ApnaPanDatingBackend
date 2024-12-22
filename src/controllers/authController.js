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
      const visitors = user.visitors.map(visitor => visitor.visitorId.toString()); // Assuming visitors is an array of ObjectIds
      const likes = user.likes.map(like => like.toString());
      const onlineSkipUser=user.onlineSkipUser.map(onlineSkip=>onlineSkip.toString())
      const onlineLikeUser=user.onlineLikeUser.map(onlineLike=>onlineLike.toString())
      // const deactivatedUser=user.deactivatedIdArray.map(deactivateUser=>deactivateUser.toString())
      const anotherMatchUser=user.anotherMatchUser.map(anotherMatch=>anotherMatch.toString())
      const users = await authUser.find();

      // Filter out users with the same city and opposite gender
      let filteredUsers = users.filter(u => u.city !== city);

      if (gender === 'Male') {
          filteredUsers = filteredUsers.filter(u => u.gender === 'Female');
      } else {
          filteredUsers = filteredUsers.filter(u => u.gender === 'Male');
      }

      // Remove users from filteredUsers if they are present in the visitors array
      filteredUsers = filteredUsers.filter(u => !visitors.includes(u._id.toString()));
      filteredUsers = filteredUsers.filter(u => !likes.includes(u._id.toString()));
      filteredUsers = filteredUsers.filter(u => !onlineSkipUser.includes(u._id.toString()));
      filteredUsers = filteredUsers.filter(u => !onlineLikeUser.includes(u._id.toString()));
      // filteredUsers = filteredUsers.filter(u => ! deactivatedUser.includes(u._id.toString()));
      filteredUsers = filteredUsers.filter(u => !anotherMatchUser.includes(u._id.toString()));

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

      const matchFilterUserArray = user.likeFilterData;
      console.log('like filter user array', matchFilterUserArray);

      const anotherMatchFilterUserArray = user.likes;
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

exports.getSkipUser = async (req, res) => { // if you want to unlike user that unlike user id store in a database with the help of these func
    try {
        const userId = req.params.id; // login person  userId
        console.log('user id is', userId);
  
        // Fetch the user object based on the provided userId
        const userObj = await authUser.findById(userId);
        if (!userObj) {
            return res.status(404).json({ mssg: "User not found" });
        }
        const getMatchSkipUserArray=userObj.filterData
        let getMatchSkipUser;
        getMatchSkipUser = await authUser.find({  
            _id: { $in: getMatchSkipUserArray }, 
            
        });
  
        res.json({ matchSkipUser: getMatchSkipUser });
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

      userObj.likeFilterData.push(matchLikeId);
      anotherUserObj.likes.push(loginId);
      // matchUserObj.matchNotify = loginId;

      const matchLikeUser = await userObj.save();
      const anotherMatchLikeUser = await anotherUserObj.save();
      // const matchUser = await matchUserObj.save();

      console.log('match person like', matchLikeUser);
      // console.log('match User', matchUser);
      let likeFilterArray;
      likeFilterArray = await authUser.find({  
          _id: { $in: matchLikeUser.likeFilterData }, 
          
      });
      
      let likesArray;
      likesArray=await authUser.find({
          _id: { $in:anotherMatchLikeUser.likes }
      })
      res.json({
          likeFilterArray:likeFilterArray,
          likesArray: likesArray,
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
        const getLikeFilterUserArray=user.likeFilterData
        const getLikesArray=user.likes
        console.log(' get like filter data',getLikeFilterUserArray)
        // const anothergetMatchUserData=user.anotherMatchData
        // const obj=await authUser.findById(user.matchNotify)

        // const deactivateUserArray=user.deactivatedIdArray
        // const blockUserArray=user.blockUserArray 
        // const oppositeBlockUserArray=user.oppositeBlockUserArray
        
        let getLikeFilterArray;
        getLikeFilterArray = await authUser.find({  
            _id: { $in: getLikeFilterUserArray }, 
            
        });
        // matchUser = matchUser.filter(matchItem => !blockUserArray.includes(matchItem._id.toString()));
        // matchUser = matchUser.filter(matchItem => !oppositeBlockUserArray.includes(matchItem._id.toString()));
        let getLikeArray;
        getLikeArray=await authUser.find({
            _id: { $in:getLikesArray }
        })
        // anotherMatchUser = anotherMatchUser.filter(anotherMatchItem => !blockUserArray.includes(anotherMatchItem._id.toString()));
        // anotherMatchUser = anotherMatchUser.filter(anotherMatchItem => !oppositeBlockUserArray.includes(anotherMatchItem._id.toString()));
        // let anotherMatchUserData;
        // anotherMatchUserData=await authUser.find({
        //     _id: { $in:anothergetMatchUserData }
        // })
       

        res.json({  likeFilterArray:getLikeFilterArray, likesArray: getLikeArray});
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

exports.addCommonVisitorLikeSkipUser=async(req,res)=>{ // function to store login user id in a like user
    try{
        const likeUserId=req.body.likeSkipUserId // like user id
        const loginId = req.params.id; // login user id
        console.log(loginId, 'likeSkipUser',likeUserId)
        const userObj = await authUser.findById(loginId);
        if (!userObj) {
                 return res.status(404).json({ mssg: "User not found" });
             }
             userObj.skipUser.push(likeUserId)
             const likeSkipUser=await userObj.save()
             let skipUserArray;
             skipUserArray = await authUser.find({  
                 _id: { $in: likeSkipUser.skipUser }, 
                 
             });

             console.log('like skip',likeSkipUser)
             res.json({likeSkip:skipUserArray})

    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}

exports.getCommonVisitorLikeSkipUser=async(req,res)=>{ // function to get data of like user
    try{
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        console.log('get like skip user is',user)
        const likeSkipUserArray=user.skipUser
        console.log(' like skip user is',likeSkipUserArray)
        let skipUser;
        skipUser = await authUser.find({  
            _id: { $in: likeSkipUserArray }, 
            
        });
        console.log('skip user array is',skipUser)
        res.json({ likeSkipUserArray:skipUser });
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}

exports.addLikeMatchUser = async (req, res) => {
    try {
        const likeMatchId = req.body.likeMatchId; // like user id 
        const loginId = req.params.id; // login user id
        console.log(likeMatchId, 'matchPlusLike', loginId);
        const userObj = await authUser.findById(loginId);
        const anotherUserObj = await authUser.findById(likeMatchId);
        // const matchUserObj = await authUser.findById(matchLikeId);
        console.log('user obj data is',userObj)
        console.log('another user obj data is',anotherUserObj)

        // if (!userObj && !anotherUserObj) {
        //     return res.status(404).json({ mssg: "User not found" });
        // }

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

        userObj.matchUser.push(likeMatchId);
        anotherUserObj.anotherMatchUser.push(loginId);
        // matchUserObj.matchNotify = loginId;

        const matchLikeUser = await userObj.save();
        const anotherMatchLikeUser = await anotherUserObj.save();
        // const matchUser = await matchUserObj.save();

        console.log('match person like', matchLikeUser);

        let matchLikeUserArray
        matchLikeUserArray = await authUser.find({  
            _id: { $in: matchLikeUser.matchUser }, 
            
        });
        
        let anotherMatchLikeUserArray
        anotherMatchLikeUserArray = await authUser.find({  
            _id: { $in:  anotherMatchLikeUser.anotherMatchUser }, 
            
        });
        // console.log('match User', matchUser);

        res.json({
            matchLikes: matchLikeUserArray,
            // loginUser: userObj,
            // anotherLoginUser: anotherUserObj,
            anotherMatchLikes: anotherMatchLikeUserArray,
            // matchUserData: matchUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
};

// exports.addLikeMatchUser = async (req, res) => {
//     try {
//         const likeMatchId = req.body.likeMatchId; // like user id 
//         const loginId = req.params.id; // login user id
//         console.log(likeMatchId, 'matchPlusLike', loginId);

//         const userObj = await authUser.findById(loginId);
//         const anotherUserObj = await authUser.findById(likeMatchId);

//         if (!userObj || !anotherUserObj) {
//             return res.status(404).json({ mssg: "User not found" });
//         }

//         // Remove loginId from visitors and likeUser arrays in the database
//         await authUser.updateOne(
//             { _id: likeMatchId },
//             {
//                 $pull: {
//                     visitors: { visitorId: loginId }, // Remove loginId from visitors
//                     likeUser: loginId, // Remove loginId from likeUser
//                 },
//             }
//         );

//         // Add loginId to anotherMatchUser array if not already present
//         if (!anotherUserObj.anotherMatchUser.includes(loginId)) {
//             anotherUserObj.anotherMatchUser.push(loginId);
//             await anotherUserObj.save();
//         }

//         // Add likeMatchId to userObj.matchUser array if not already present
//         if (!userObj.matchUser.includes(likeMatchId)) {
//             userObj.matchUser.push(likeMatchId);
//             await userObj.save();
//         }

//         // Fetch matchUser details for response
//         let matchLikeUserArray = await authUser.find({
//             _id: { $in: userObj.matchUser },
//         });

//         let anotherMatchLikeUserArray = await authUser.find({
//             _id: { $in: anotherUserObj.anotherMatchUser },
//         });

//         res.json({
//             matchLikes: matchLikeUserArray,
//             anotherMatchLikes: anotherMatchLikeUserArray,
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// };

exports.getLikeMatchUser=async(req,res)=>{ // function to get data of like user
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
        const blockUserArray=user.blockUserArray 
        const oppositeBlockUserArray=user.oppositeBlockUserArray
        
        let matchUser;
        matchUser = await authUser.find({  
            _id: { $in: getMatchUserArray }, 
            
        });
        matchUser = matchUser.filter(matchItem => !blockUserArray.includes(matchItem._id.toString()));
        matchUser = matchUser.filter(matchItem => !oppositeBlockUserArray.includes(matchItem._id.toString()));
        let anotherMatchUser;
        anotherMatchUser=await authUser.find({
            _id: { $in:anothergetMatchUserArray }
        })
        anotherMatchUser = anotherMatchUser.filter(anotherMatchItem => !blockUserArray.includes(anotherMatchItem._id.toString()));
        anotherMatchUser = anotherMatchUser.filter(anotherMatchItem => !oppositeBlockUserArray.includes(anotherMatchItem._id.toString()));
        // let anotherMatchUserData;
        // anotherMatchUserData=await authUser.find({
        //     _id: { $in:anothergetMatchUserData }
        // })
       

        res.json({matchLikes: matchUser,anotherMatchLikes:anotherMatchUser  });
        // setTimeout(async () => {
        //     user.matchNotify = null; // Clear the notification
        //     await user.save(); // Save the changes
        //   }, 5000);
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}

exports.addOnlineSkipUser=async(req,res)=>{ // function to store login user id in a like user
    try{
        const onlinePersonUserId=req.body.onlinePersonSkipUserId // like user id
        const loginUserId = req.params.id; // login user id
        console.log(loginUserId, 'onlinePlusSkip',onlinePersonUserId)
        const userObj = await authUser.findById(loginUserId);
        if (!userObj) {
                 return res.status(404).json({ mssg: "User not found" });
             }
             userObj.onlineSkipUser.push(onlinePersonUserId)
             const onlinePersonSkipUser=await userObj.save()
             console.log('online person skip',onlinePersonSkipUser)
             res.json({onlineSkip:onlinePersonSkipUser})

    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}

exports.getOnlineSkipUser = async (req, res) => { // if you want to unlike user that unlike user id store in a database with the help of these func
    try {
        const userId = req.params.id; // login person  userId
        console.log('user id is', userId);
  
        // Fetch the user object based on the provided userId
        const userObj = await authUser.findById(userId);
        if (!userObj) {
            return res.status(404).json({ mssg: "User not found" });
        }
        const getOnlineSkipUserArray=userObj.onlineSkipUser
        let getOnlineSkipUser;
        getOnlineSkipUser = await authUser.find({  
            _id: { $in: getOnlineSkipUserArray }, 
            
        });
  
        res.json({ getOnlineSkipUser: getOnlineSkipUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
  };
  
exports.addOnlineLikeUser=async(req,res)=>{ // function to store login user id in a like user
    try{
        const onlinePersonLikeUserId=req.body.onlinePersonLikeUserId // like user id
        const loginUserId = req.params.id; // login user id
        console.log(loginUserId, 'onlinePlusSkip',onlinePersonLikeUserId)
        const userObj = await authUser.findById(loginUserId);
        const anotherUserObj = await authUser.findById(onlinePersonLikeUserId)
        if (!userObj) {
                 return res.status(404).json({ mssg: "User not found" });
             }
             userObj.selfOnlineLikeUser.push(onlinePersonLikeUserId)
             anotherUserObj.onlineLikeUser.push(loginUserId)
            //  anotherUserObj.visitors = anotherUserObj.visitors.filter(anotherVisitor => anotherVisitor.visitorId !== loginUserId);
             const onlinePersonLikeUser=await userObj.save()
             const anotherOnlinePersonLikeUser=await anotherUserObj.save()
             console.log('online person skip',onlinePersonLikeUser)

             let onlineLikeUserArray
             onlineLikeUserArray=await authUser.find({
                _id: { $in:anotherOnlinePersonLikeUser.onlineLikeUser }
            })

            let selfOnlineLikeUserArray
            selfOnlineLikeUserArray=await authUser.find({
               _id: { $in:onlinePersonLikeUser.selfOnlineLikeUser }
           })
             res.json({onlineLikeUser:onlineLikeUserArray,selfOnlineLikeUser:selfOnlineLikeUserArray})

    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}

exports.getOnlineLikeUser = async (req, res) => {
    try {
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        
        if (!user) {
            return res.status(404).json({ mssg: "User not found" });
        }
        // const blockUserArray=user.blockUserArray
        // const oppositeBlockUserArray=user.oppositeBlockUserArray

        let onlineLikeUserArray
         onlineLikeUserArray = user.onlineLikeUser;
        //  onlineLikeUserArray=onlineLikeUserArray.filter(onlineLikeItem=>!blockUserArray.includes(onlineLikeItem._id.toString()))
        //  onlineLikeUserArray=onlineLikeUserArray.filter(onlineLikeItem=>!oppositeBlockUserArray.includes(onlineLikeItem._id.toString()))

        const onlineLikeUserData = await authUser.find({ _id: { $in: onlineLikeUserArray } });
        
        let selfOnlineLikeUserArray
        selfOnlineLikeUserArray = user.selfOnlineLikeUser;
        // selfOnlineLikeUserArray = selfOnlineLikeUserArray .filter(selfOnlineLikeItem=>!blockUserArray.includes(selfOnlineLikeItem._id.toString()))
        // selfOnlineLikeUserArray = selfOnlineLikeUserArray .filter(selfOnlineLikeItem=>!oppositeBlockUserArray.includes(selfOnlineLikeItem._id.toString()))

        const selfOnlineLikeUserData = await authUser.find({ _id: { $in: selfOnlineLikeUserArray } });

        // Remove visitors that are also in selfOnlineLikeUserArray
        // user.visitors = user.visitors.filter(visitor => 
        //     !onlineLikeUserArray.includes(visitor.visitorId)
        // );
       
        // const deactivateUserArray = user.deactivatedIdArray;
        // const filteredOnlineLikeUserData = onlineLikeUserData.filter(user => {
        //     return !deactivateUserArray.includes(user._id.toString());
        // });
        
        // console.log('visitors of like User', user.visitors);

        // Save the updated user object
        await user.save();

        res.json({ onlineLikeUser: onlineLikeUserData, selfOnlineLikeUser: selfOnlineLikeUserData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
};


exports.addVisitorUser = async (req, res) => {
    try {
        const personUserId = req.body.userId; // login user id
        const visitorUserId = req.params.id; // visitor id
        const userObj = await authUser.findById(personUserId);
        
        if (!userObj) {
            return res.status(404).json({ mssg: "User not found" });
        }
        
        // Check if the visitorId already exists in the visitors array
        const visitorExists = userObj.visitors.some(visitor => visitor.visitorId.toString() === visitorUserId);

        if (visitorExists) {
            return res.status(400).json({ mssg: "Visitor already added" });
        }

        const visitorData = {
            visitorId: visitorUserId,
            visitedAt: new Date()
        };
        
        userObj.visitors.push(visitorData);
        const visitorsUser = await userObj.save();

        let visitorUserArray
        visitorUserArray=await authUser.find({
           _id: { $in:visitorsUser.visitors }
       })
        res.json({ visitors: visitorUserArray });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
};


const formatTimeDifference = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    if (diffHrs === 1) return `yesterday`;
    
    if (diffHrs > 28) {
        // Format the date as 'Month Day, Year'
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    return `${diffDays} days ago`;
};

// Example usage
const visitDate = new Date('2024-06-08T10:00:00Z');
console.log('format date', formatTimeDifference(visitDate));


exports.getVisitorUser = async (req, res) => {
    try {
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        
        if (!user) {
            return res.status(404).json({ mssg: "User not found" });
        }
        
        const visitorUserArray = user.visitors.map(visitor => visitor.visitorId);
        const getVisitors = await authUser.find({ _id: { $in: visitorUserArray } });

        // Combine visitor details with the formatted time
        let visitorsWithTime = user.visitors.map(visitor => {
            const visitorInfo = getVisitors.find(u => u._id.toString() === visitor.visitorId.toString());
            return {
                visitor: visitorInfo,
                visitedAt: formatTimeDifference(new Date(visitor.visitedAt))
            };
        });

        // Filter out visitors who are in user.onlineLikeUser array
        visitorsWithTime = visitorsWithTime.filter(visitorWithTime => {
            return !user.onlineLikeUser.some(onlineLikeUserId => onlineLikeUserId.toString() === visitorWithTime.visitor._id.toString());
        });
        // visitorsWithTime = visitorsWithTime.filter(visitorWithTime => {
        //     return !user.deactivatedIdArray.some(deactivateUserId => deactivateUserId.toString() === visitorWithTime.visitor._id.toString());
        // });
        // visitorsWithTime = visitorsWithTime.filter(visitorWithTime => {
        //     return !user.blockUserArray.some(blockUserId => blockUserId.toString() === visitorWithTime.visitor._id.toString())
        // });
        // visitorsWithTime = visitorsWithTime.filter(visitorWithTime => {
        //     return !user.oppositeBlockUserArray.some(oppositeBlockUserId => oppositeBlockUserId.toString() === visitorWithTime.visitor._id.toString())
        // });
        res.json({ visitors: visitorsWithTime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
};


exports.addVisitorCountUser = async (req, res) => {
    try {
      const id = req.params.id;
      const userId=req.body.visitorOnlineId
      const userObj = await authUser.findById(userId);
      // console.log('user data obj',userObj)
      if (userObj) {
        userObj.visitorCounter = userObj.visitorCounter ? userObj.visitorCounter + 1 : 1; // Incrementing the counter value
        await userObj.save(); // Saving the updated userObj
      //   io.emit('new counter', { userId: userId, counter: userObj.counter });
        console.log('Updated userObj:', userObj);
        res.status(200).send({ message: 'visitor Counter incremented successfully', userObj:userObj });
      } 
   
      else {
        
        res.status(404).send({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };
// exports.addVisitorCountUser = async (req, res) => {
//     try {
//       const id = req.params.id; // Not used in the current logic, remove if unnecessary
//       const userId = req.body.visitorOnlineId;
//       const userObj = await authUser.findById(userId);
  
//       if (userObj) {
//         const isVisitorInAnotherMatch = userObj.visitors.some(visitorId =>
//           userObj.anotherMatchUser.includes(visitorId)
//         );
  
//         if (!isVisitorInAnotherMatch) {
//           userObj.visitorCounter = userObj.visitorCounter ? userObj.visitorCounter + 1 : 1; // Incrementing the counter
//           await userObj.save(); // Save updated userObj
//           io.emit('new counter', { userId: userId, counter: userObj.visitorCounter });
//           console.log('Updated userObj:', userObj);
  
//           res.status(200).send({
//             message: 'Visitor counter incremented successfully',
//             userObj: userObj,
//           });
//         } else {
//           res.status(200).send({
//             message: 'Visitor is in anotherMatchUser array, counter not incremented',
//           });
//         }
//       } else {
//         res.status(404).send({ message: 'User not found' });
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).send({ message: 'Internal server error' });
//     }
//   };
  

  
  exports.getVisitorCountUser=async(req,res)=>{
    try{
        const userId = req.params.id; 
        const user = await authUser.findById(userId);
        console.log('get visitor count user is',user.visitorCounter)
        res.json({userObj:user });
     
    } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

exports.deleteVisitorCounterUser = async (req, res) => {
    try {
        const userId = req.body.loginId;
        const user = await authUser.findById(userId);
        console.log('user id in visitor count',userId)
        
        if (user) {
            // Delete the counter property from the user object
            user.visitorCounter = null; // or delete user.counter;

            // Save the updated user object
            await user.save();
           
            console.log('visitor Counter deleted for user:', user);
            const io = req.app.locals.io;
            io.emit('deleteVisitorCount', user.visitorCounter);
         
            res.status(200).send({ message: 'visitor Counter deleted successfully', userObj:user });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

exports.addVisitorSendEmailUser = async (req, res) => {
    try {
        const senderEmailId = req.body.recieverEmailId; // like user id
        const loginEmailId = req.params.id; // login user id
        console.log(senderEmailId, 'sender id', loginEmailId);

        const userObj = await authUser.findById(senderEmailId);
        console.log('sender user obj is', userObj);

        const likeUserObj = await authUser.findById(loginEmailId);
        const userObjSendMail = userObj.visitors.some(visitor => visitor.visitorId.toString() === loginEmailId.toString());
        if (userObjSendMail) {
            return res.status(200).json({ message: 'Email not sent as the visitor already exists.' });
          }
      
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'apnapan96@gmail.com',
                pass: 'nmhlhhjvahmjqmlz'
            }
        });

        // Set up email options
        const mailOptions = {
            from: 'apnapan96@gmail.com',
            to: userObj.email,
            subject: `Hey ${userObj.firstName} - there was a new visitor on your profile. Check them out`,
            html: `<h1 style="text-Align:center; font-size:30px;font-weight:bold">ApnaPan</h1>
            <hr style="color:grey;"/>
            <p style="padding-top:1rem;font-size:1.2rem">Hi ${userObj.firstName},</p>
            <p style="font-weight:bold; padding-top:1rem;font-size:1.2rem;color:black">${likeUserObj.firstName} <span style="font-weight:normal;">visited you / browse through your profile.Go check it out</span></p>
            <div style='display:flex;justify-content:center;margin-top:4rem'>
            <a href="https://apnapandating.netlify.app/" style="text-decoration:none;"> <button type='btn' style="background-color:green;font-size:17px;font-weight:bold;color:white;height:45px;width:18rem;border-radius:25px;cursor:pointer" >See your visitors</button></a>
            </div>`
        };

        // Send the email
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', result);
        res.status(200).json({ mssg: "Email sent successfully" ,result:result});

    } catch (error) {
        console.error('Error sending Email:', error);
    }
};

exports.addVisitorLikeUser=async(req,res)=>{ // function to store login user id in a like user
    try{
        const personUserId=req.body.visitorPlusLikeUserId // like user id
        const likesUserId = req.params.id; // login user id
        console.log(personUserId, 'visitorPlusLike',likesUserId)
        const userObj = await authUser.findById(likesUserId);
        const anotherUserObj = await authUser.findById(personUserId);
        if (!userObj || !anotherUserObj) {
                 return res.status(404).json({ mssg: "User not found" });
             }
             userObj.likeUser.push(personUserId)
             anotherUserObj.likes.push(likesUserId)
             const visitorPlusLikeUser=await userObj.save()
             const visitorLikeUser=await anotherUserObj.save()
             let visitorPlusLikeUserArray
             visitorPlusLikeUserArray=await authUser.find({
                _id: { $in:visitorPlusLikeUser.likeUser }
            })
            let visitorLikeArray
            visitorLikeArray=await authUser.find({
                _id: { $in:visitorLikeUser.likes }
            })
             console.log('visitor person like',visitorPlusLikeUser)
             res.json({visitorLikes:visitorPlusLikeUserArray,likes:visitorLikeArray})

    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}

exports.getVisitorLikeUser=async(req,res)=>{ // function to get data of like user
    try{
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        console.log('get visitor plus like user is',user)
        // const blockUserArray=user.blockUserArray
        // const oppositeBlockUserArray=user.oppositeBlockUserArray
        let likeVisitorUserArray
       likeVisitorUserArray=user.likeUser
    //    likeVisitorUserArray = likeVisitorUserArray.filter(likeVisitorItem => !blockUserArray.includes(likeVisitorItem._id.toString()));
    //    likeVisitorUserArray = likeVisitorUserArray.filter(likeVisitorItem => !oppositeBlockUserArray.includes(likeVisitorItem._id.toString()));
        console.log(' like plus visitors is',likeVisitorUserArray)
        let likeUser;
        likeUser = await authUser.find({  
            _id: { $in: likeVisitorUserArray }, 
            
        });
        let likes
        likes=await authUser.find({
            _id: { $in:likeVisitorUserArray.likes }
        })
        res.json({visitorLikes:likeUser,likes:likes });
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}

exports.deleteSkipProfileUser = async (req, res) => {
    console.log('Response of skip profile:', req.body);
    try {
        const id = req.params.id;
        const deleteUserId = req.query.deleteUserId;
        console.log('Delete user ID:', deleteUserId);

        const user = await authUser.findById(id);
        if (!user) {
            return res.status(404).json({ mssg: "User not found" });
        }

        console.log('User before deletion:', user);

        // await authUser.updateOne( // keval single data delete karne ke liye
        //     { _id: id },
        //     { $pull: { onlineSkipUser: deleteUserId } }
        // );
        await authUser.updateOne(
            { _id: id },
            {
              $pull: {
                onlineSkipUser: deleteUserId,
                filterData: deleteUserId
              }
            }
        );
        console.log('User after deletion:', await authUser.findById(id));

        res.status(200).json({ mssg: "User updated successfully" ,deleteId:deleteUserId});
    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
};
exports.blockChatIdUser=async(req,res)=>{
    try{
   const id=req.params.id
   const blockId=req.body.blockId
   const loginObj=await authUser.findById(id)
   const blockObj=await authUser.findById(blockId)
   
   if (!loginObj) {
    return res.status(404).send({ mssg: 'User not found' });
}
   loginObj.blockUserArray.push(blockId)
   blockObj.oppositeBlockUserArray.push(id)
   const finalLoginObj=await loginObj.save()
   const finalOppositeLoginObj=await blockObj.save()
   let blockUser;
   blockUser = await authUser.find({  
       _id: { $in: finalLoginObj.blockUserArray }, 
       
   });
   let anotherBlockUser
   anotherBlockUser = await authUser.find({  
    _id: { $in: finalOppositeLoginObj.oppositeBlockUserArray }, 
    
});
   res.status(200).send({mssg:'block user successfully',blockUserArray:blockUser,anotherBlockUserArray:anotherBlockUser})
    }catch(e){
        res.status(500).send({mssg:'internal server error'})   
    }
}
exports.getBlockChatIdUser=async(req,res)=>{
    try{
        const id=req.params.id
        const loginObj=await authUser.findById(id)
        const blockUserArrayData=loginObj.blockUserArray
        const anotherBlockUserArrayData=loginObj.oppositeBlockUserArray
        const blockUserArray=await authUser.find({
            _id:{$in:blockUserArrayData}
        })
        const anotherBlockUserArray=await authUser.find({
            _id:{$in:anotherBlockUserArrayData}
        })
        res.status(200).send({mssg:'block message fetch data successfuly',blockUserArray:blockUserArray,anotherBlockUserArray:anotherBlockUserArray})

    }catch(e){
        res.status(500).send({mssg:'internal server error'})    
    }
}
// exports.deleteBlockUser = async (req, res) => {
//     try {
//         const id = req.params.id; // Logged-in user ID
//         const blockId = req.query.blockId; // ID of the user to unblock

//         // Find the logged-in user and the blocked user
//         const loginObj = await authUser.findById(id);
//         const blockObj = await authUser.findById(blockId);

//         if (!loginObj || !blockObj) {
//             return res.status(404).send({ mssg: 'User not found' });
//         }

//         // Remove blockId from blockUserArray of the logged-in user
//         await authUser.findByIdAndUpdate(id, {
//             $pull: { blockUserArray: blockId }
//         });

//         // Remove id from oppositeBlockUserArray of the blocked user
//         await authUser.findByIdAndUpdate(blockId, {
//             $pull: { oppositeBlockUserArray: id }
//         }); 

//         res.send({ mssg: 'User unblocked successfully' });
//     } catch (e) {
//         console.error(e);
//         res.status(500).send({ mssg: 'Internal server error' });
//     }

// };
exports.deleteBlockUser = async (req, res) => {
    try {
        const id = req.params.id; // Logged-in user ID
        const blockId = req.body.blockId; // ID of the user to unblock

        // Find the logged-in user and the blocked user
        const loginObj = await authUser.findById(id);
        const blockObj = await authUser.findById(blockId);

        if (!loginObj || !blockObj) {
            return res.status(404).send({ mssg: 'User not found' });
        }

        // Remove blockId from blockUserArray of the logged-in user
        await authUser.findByIdAndUpdate(id, {
            $pull: { blockUserArray: blockId }
        });

        // Remove id from oppositeBlockUserArray of the blocked user
        await authUser.findByIdAndUpdate(blockId, {
            $pull: { oppositeBlockUserArray: id }
        });

        // Fetch updated documents
        const updatedLoginObj = await authUser.findById(id).select('blockUserArray');
        const updatedBlockObj = await authUser.findById(blockId).select('oppositeBlockUserArray');

        // Fetch updated block users based on IDs
        const blockUser = await authUser.find({
            _id: { $in: updatedLoginObj.blockUserArray }
        });

        const anotherBlockUser = await authUser.find({
            _id: { $in: updatedBlockObj.oppositeBlockUserArray }
        });

        res.send({
            mssg: 'User unblocked successfully',
            blockUserArray: blockUser,
            anotherBlockUserArray: anotherBlockUser
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({ mssg: 'Internal server error' });
    }
};
