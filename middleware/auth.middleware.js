const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        // res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token2 = req.headers.authorization;
  if (token2) {
    // jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
    jwt.verify(token2.replace(/^Bearer\s/, ''),process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        // res.send(401).json({error: 'no token'})
      } else {
        console.log("decodedToken.id",decodedToken);
        const user = await UserModel.findById(decodedToken.id);
        //mettre dans un try catch
        req.currentUser = user;
        next();
      }
    });
  } else {
    res.send(401)({error: 'no token'})
    console.log('No token');
    res.send(401)({error: 'no token'});
  }
};