const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRoute = require('./routes/user');
const publiRoute = require('./routes/publication');
const commentRoute = require('./routes/comment');
const likeRoute = require('./routes/like');
const userAuthRoute = require('./routes/auth')
const notifRoutes = require('./routes/notifications')
const path = require('path')
require('dotenv').config()

app.use(bodyParser.json());
app.use(express.urlencoded());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use('/api/users', userRoute);
app.use('/api/auth', userAuthRoute)
app.use('/api/publications', publiRoute);
app.use('/api/comments', commentRoute);
app.use('/api/likes', likeRoute);
app.use('/api/notifications', notifRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;