const jwt=require("jsonwebtoken")
const User = require("../models/user")
const secretKey="Sanchit@123$"
function setUser(user) {
    return jwt.sign({
    userEmail:user.userEmail},secretKey)
}

function getUser(token) {
    if(!token) return null
    return jwt.verify(token,secretKey)
}


module.exports={setUser,getUser}