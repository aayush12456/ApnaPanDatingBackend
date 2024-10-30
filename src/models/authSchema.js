const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Schema}=mongoose
const authSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email is already present"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    min: 10,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    min: 10,
  },
  DOB: {
    type: String,
    required: true,
    min: 10,
  },
  city: {
    type: String,
    required: true,
    min: 10,
  },
  aboutUser: {
    type: String,
    required: true,
    min: 10,
  },

//  images:{  // single file schema
//     type: String,
//  },
// images: [{
//   type:String,
//   required:true
// }],
// cloudImages:{
// type:String
// },
images: [{
  type:String,
  // required:true
}],
  // interest: {
  //   type: String,
  //   required: true,
  // },
  interest: [{
    type: String,
    required: true,
  }],
  education: {
    type: String,
    required: true,
    min: 10,
  },
  drinking: {
    type: String,
    required: true,
    min: 10,
  },
  smoking: {
    type: String,
    required: true,
    min: 10,
  },
  eating: {
    type: String,
    required: true,
    min: 10,
  },
  interest: [{
    type: String,
    required: true,
    minLength: 1 // Minimum length of each interest string
  }],
  profession: {
    type: String,
    required: true,
    min: 10,
  },
  looking: {
    type: String,
    required: true,
    min: 2,
  },
  relationship: {
    type: String,
    required: true,
    
  },
  zodiac: {
    type: String,
    required: true,
    
  },
  language: {
    type: String,
    // required: true,
    
  },
  counter:{
  type:Number
  },
  likeCounter:{
    type:Number
    },
  notify:{
    type:String
  },
  likeNotify:{
    type:String
  },
 

  filterData:[ // schema for unlike user id
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  
  // visitors:[ // schema for visitor user id
  //   {
  //     type:Schema.Types.ObjectId,
  //     ref:'UserData',
 
  //   }
  // ],
  visitors: [
    {
        visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'authUser' },
        visitedAt: { type: Date, default: Date.now }
    }
],
  likes:[ // schema for like user id
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  likeFilterData:[ // schema for likeFilterUser id
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  likeUser:[ // schema for likeUser when comes in like or visitor section in a id format
  {
    type:Schema.Types.ObjectId,
    ref:'UserData'
  },
],
skipUser:[ // schema for skipUser when comes in like or visitor section in a id format
{
  type:Schema.Types.ObjectId,
  ref:'UserData'
}
],
matchUser:[ // to store id which has come in like section
{
  type:Schema.Types.ObjectId,
  ref:'UserData'
}
],

anotherMatchUser:[ // to store id of loginUser
{
  type:Schema.Types.ObjectId,
  ref:'UserData'
}
],
anotherMatchData:[ // to store id of loginUser
{
  type:Schema.Types.ObjectId,
  ref:'UserData'
}
],
anotherLikeUser:[
  {
    type:Schema.Types.ObjectId,
    ref:'UserData'
  }
],
matchNotify:{ //to store id of loginUser
  type:String
},
  addToChatData:[
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  hideRemainMatch:[
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],

  onlineLikeUser:[
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  likeMatch:[
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  anotherlikeMatch:[
    {
      type:Schema.Types.ObjectId,
      ref:'UserData'
    }
  ],
  sidebarTitle:{
    type:String
  },
  videoUrl:{
    type:String
  },
  PersonalProfileModalHeading:{
    type:String
  },
onlineSkipUser:[
  {
    type:Schema.Types.ObjectId,
    ref:'UserData'
  }
],
onlineLikeUser:[
  {
    type:Schema.Types.ObjectId,
    ref:'UserData'
  }
],
selfOnlineLikeUser:[
  {
    type:Schema.Types.ObjectId,
    ref:'UserData'
  }
],
deactivation:{
  type:String
},
deactivatedId:{
  type:String
},
songId:{
  type:String
},
deactivatedIdArray:[
  {
    type:Schema.Types.ObjectId,
    ref:'UserData'
  }
],
blockUserArray:[
  {
    type:Schema.Types.ObjectId,
    ref:'UserData'
  }
],
oppositeBlockUserArray:[
  {
    type:Schema.Types.ObjectId,
    ref:'UserData'
  }
],
otp:{
  type:String
},
postTyping:{
  loginId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
  },
  recieverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
  },
  message: {
    type: String,
    ref: 'UserData',
  },
},
// postTyping:[
//   {
//     loginId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'UserData',
//     },
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'UserData',
//     },
//     recieverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'UserData',
//     },
//     message: {
//       type: String,
//       ref: 'UserData',
//     },
//   }
 
// ],
messageNotify: [
  {
    loginId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserData',
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserData',
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserData',
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserData',
    },
    senderName: {
      type: String,
      ref: 'UserData',
    },
    message: {
      type: String,
      ref: 'UserData',
    },
   images:{
    type:String
   },
    timestamp: {
      type: Date,
      required: true,
    }
  }
],
recordChat: [
  {
    loginId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserData',
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserData',
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserData',
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserData',
    },
    message: {
      type: String,
      ref: 'UserData',
    },
    timestamp: { type: String } 
  }
],
},

);


authSchema.methods.generateAuthToken = async function () {
  try {
    console.log('toke data',this._id);
    // const token = jwt.sign(
    //   { _id: this._id.toString() },
    //   process.env.registerData,
    //   {
    //     expiresIn: 3600,
    //   }
    // );
    const token = jwt.sign(
        { _id: this._id.toString() },
        'registerData',
        {
          expiresIn: 3600,
        }
      );
    return token;
  } catch (e) {
    res.status(400).send({ mssg: "token does not exist" });
  }
};
authSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`the current pass is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`the new  pass is ${this.password}`);
  }
  next();
});
const registerUser = new mongoose.model("UserData", authSchema);
// const registerUser = new mongoose.model("ApnaPanUserDatas", authSchema);
module.exports = registerUser;
