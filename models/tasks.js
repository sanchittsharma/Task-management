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
        type:Date,
        required: true,
    },
    status:{
        type:String,
        enum:['completed','pending'],
        required:true
    }

})

const Tasks=mongoose.model("Tasks",taskSchema)
module.exports=Tasks