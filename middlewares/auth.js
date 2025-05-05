// const User = require("../models/user");
// const {getUser}=require("../service/auth")
// const jwt=require("jsonwebtoken")
// async function restrictToLoginUser(req,res,next) {
//     const userUid=req.cookies?.uid
//     if(!userUid)  return res.redirect("/")
//         if(!User)  return res.redirect("/")
//     const decoded = jwt.verify(userUid, "Sanchit@123$"); 
// console.log(decoded);
 
//     const user = await User.findOne({ userEmail: decoded.userEmail });
//     req.user = user;
//     console.log(user);
    
// next()

// } 
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = "Sanchit@123$";

async function restrictToLoginUser(req, res, next) {
  // Get the token from the cookies
  const userUid = req.cookies?.uid;
  if (!userUid) {
    console.log("No token found in cookies.");
    return res.redirect("/"); 
  }

  try {
    // Decode the token
    const decoded = jwt.verify(userUid, secretKey);
    const user = await User.findOne({ userEmail: decoded.userEmail });
    if (!user) {
      console.log("User not found:", decoded.userEmail);
      return res.redirect("/");  
    }
    req.user = user;
    // console.log( user);

    next();  
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.redirect("/");  
  }
}


module.exports={restrictToLoginUser}


