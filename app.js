
const express = require('express');
const ngrok = require('ngrok')
const http = require('http');
const db = require('./src/db/db');
const userRoutes = require('./src/routes/authRoutes');
const path = require('path');
const cors = require("cors");
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
