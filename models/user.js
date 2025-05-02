const mongoose=require("mongoose")
const taskSchema=new mongoose.Schema({
    taskName:{
        type:String,
        required:true
    },
    taskPriority:{
        type:String,
        required:true,
        enum: ['Low', 'Medium', 'High']
    },
    description:{
        type:String,
        required:true
    },
    dueDate:{
        type:String,
        required: true,
    },
    status:{
        type:String,
        enum:['Completed','Pending'],
        required:true
    }

})
const userSchema =new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    userPassword:{
        type:String,
        required:true,
    },
    roles:{
   type:String,
   enum:['Admin','User'],
   default:"User"
    },
    tasks:[taskSchema]
},{timestamps:true})
const User=mongoose.model("User",userSchema)
// User.create({
//     userName:"AdminSanchit",
//     userEmail:"admin@gmail.com",
//     userPassword:"admin123",
//     roles:"Admin"

// })

// const adminTask=User.findOne({userEmail:"admin@gmail.com"})
// adminTask.tasks=({
//     taskName:"Manage",
//     taskPriority:"High",
//     description:"Manage Users",
//     dueDate:"01-05-25",
//     status:"Completed"
// })

module.exports=User