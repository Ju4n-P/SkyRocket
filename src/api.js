const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({path: './config/.env'});
require('../config/db');
const userRoutes = require('../routes/user.routes');
const postRoutes = require('../routes/post.routes');
const {checkUser, requireAuth} = require('../middleware/auth.middleware');
const cors = require('cors');
const serverless = require("serverless-http")

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  'allowedHeaders': ['Authorization', 'Content-Type'],    
  'exposedHeaders': ['Authorization'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': true
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});

// routes
app.use('/.netlify/functions/api/user', userRoutes);
app.use('/.netlify/functions/api/post', postRoutes);
/.netlify/functions/server/
// server
// app.listen(process.env.PORT || 3000, () => {
//   console.log(`Listening on port ${process.env.PORT}`);
// })

module.exports.handler = serverless(app)