const express=require("express")
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser=require("cookie-parser")
const {restrictToLoginUser}=require("./middlewares/auth")
const userRouter=require("./routes/user")
const staticRoute=require("./routes/staticRoute")
const path=require("path")
const {connectMongoDb}=require("./connection")
const app=express();
const port=9002



connectMongoDb("mongodb://127.0.0.1:27017/taskManager").then(()=>{
    console.log('MongoDb connected');
    
})
app.use(methodOverride("_method"))
app.use(express.static('public'));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.set("view engine" ,"ejs")
app.set("views",path.resolve("./views"))

app.use("/",userRouter)

// app.use("/",staticRoute)

app.listen(port,()=>{
    console.log(`server started at port ${port}`);
    
})