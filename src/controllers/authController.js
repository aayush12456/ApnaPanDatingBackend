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
        loginData: { name:data.firstName,image:data.images[0] },
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
