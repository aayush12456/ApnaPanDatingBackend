
const express = require('express');
const ngrok = require('ngrok')
const http = require('http');
const db = require('./src/db/db');
const userRoutes = require('./src/routes/authRoutes');
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
    socket.on('addLikeSkipUser',(user)=>{
        io.emit('getLikeSkipUser',user)
    })
    socket.on('addLikeMatchUser',(user)=>{
        io.emit('getLikeMatchUser',user)
    })
    socket.on('addOnlineSkipUser',(user)=>{
        io.emit('getOnlineSkipUser',user)
    })
    socket.on('disconnect', (reason) => {
        console.log('A user disconnected with socket ID:', socket.id,'reason is',reason);
    });
});

module.exports = { io };
