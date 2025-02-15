
const express = require('express');
const ngrok = require('ngrok')
const http = require('http');
const db = require('./src/db/db');
const userRoutes = require('./src/routes/authRoutes');
const chatRoutes=require('./src/routes/chatRoutes')
const path = require('path');
const cors = require("cors");
const socketCon = require('./socket');
const app = express();
const server = http.createServer(app);

const corsOptions = {
    // origin: 'http://192.168.29.169:8081',
    origin: '*',
    // origin: 'https://apnapandating.netlify.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '80mb' }));
app.use('/images', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/user', userRoutes);
app.use('/chat',chatRoutes)

app.get('/ping', (req, res) => {
    res.status(200).send('Server is alive');
});

const port = process.env.PORT || 4000;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://192.168.29.169:${port}`);
    ngrok.connect(port).then(ngrokUrl=>{
        console.log(`ngrok connection is ${ngrokUrl}`)
    }).catch(error=>{
        console.log(`ngrok connection not there ${error}`)
    })
});
const io = require('socket.io')(server, {
    cors: {
        origin: '*', // or your frontend URL
        // origin: 'https://apnapandating.netlify.app',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
        pingTimeout:600000,
        pingInerval:25000
        // pingTimeout: 120000, // Reduced to 2 minutes
        // pingInterval: 10000, // Reduced to 10 seconds
    }
});
app.locals.io = io;
socketCon.init(io);
// Basic socket connection
io.on('connection', (socket) => {
    console.log('A new user connected with socket ID:', socket.id );
     
    // // Emit a connected message to the client
    // socket.emit('connected', `Socket connected: ${socket.id}`);
    // Handle disconnection
    socket.on('addMatchUser',(message)=>{
        io.emit('getMatchUser',message)
    })

    socket.on('addLikeCountUser',(count)=>{
        io.emit('getLikeCountUser',count)
    })
    socket.on('addCommonVisitorLikeSkipUser',(user)=>{
        io.emit('getCommonVisitorLikeSkipUser',user)
    })
    socket.on('addLikeMatchUser',(user)=>{
        io.emit('getLikeMatchUser',user)
    })
    socket.on('addOnlineSkipUser',(user)=>{
        io.emit('getOnlineSkipUser',user)
    })
    socket.on('addOnlineLikeUser',(user)=>{
        io.emit('getOnlineLikeUser',user)
    })
    socket.on('addVisitorUser',(user)=>{
        io.emit('getVisitorUser',user)
    })
    socket.on('addVisitorCountUser',(user)=>{
        io.emit('getVisitorCountUser',user)
    })
    socket.on('addVisitorLikeUser',(user)=>{
        io.emit('getVisitorLikeUser',user)
    })
    socket.on('addChatIdUser',(user)=>{
        io.emit('getChatIdUser',user)
    })
    socket.on('sendMessage',(newMessage)=>{
        io.emit('recieveMessage',newMessage)

    })
    socket.on('addDeactivateUser',(deactivatedUser)=>{
        io.emit('getDeactivateUser',deactivatedUser)

    })
    socket.on('addActivateUser',(activateUser)=>{
        io.emit('getDeactivateUser',activateUser)

    })
    socket.on('addBlockUser',(blockUser)=>{
        io.emit('getBlockUser',blockUser)
    })
    //    socket.on('addResetSkipProfile',(resetProfile)=>{
    //     io.emit('getResetSkipProfile',resetProfile)
    // })
    socket.on('deleteBlockUser',(blockUser)=>{
        io.emit('getBlockUser',blockUser)
    })
    socket.on('postTyping',(blockUser)=>{
        io.emit('getTyping',blockUser)
    })
    socket.on('loginUser',(loginUser)=>{
        io.emit('getLoginUser',loginUser)
    })
    socket.on('addRecordMessageId',(newId)=>{
        io.emit('recieveRecordMessageId',newId)

    })
    socket.on('deleteRecordMessageId',(newId)=>{
        io.emit('recieveRecordMessageId',newId)

    })
    // socket.on('addVisitorNotify',(newId)=>{
    //     io.emit('getVisitorNotify',newId)

    // })
    socket.on('deleteVisitorNotify',(newId)=>{
        io.emit('getVisitorCountUser',newId)

    })
    socket.on('addSongObj',(newId)=>{
        io.emit('getSongObj',newId)

    })
    socket.on('disconnect', (reason) => {
        console.log('A user disconnected with socket ID:', socket.id,'reason is',reason);
    });
});

module.exports = { io };
