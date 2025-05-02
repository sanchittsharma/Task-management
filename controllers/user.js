const User = require("../models/user")
// const{v4: uuidv4}=require("uuid")
const {getUser,setUser}=require("../service/auth")
const user=require("../routes/user");
const Tasks = require("../models/tasks");

async function handleLoginUser(req,res) {
    const body=req.body
    
    if (body.userEmail==" " || body.userPassword===" ") {
        return res.status(404).send(`
      <script>
        alert('Enter all field');
        window.location.href = '/'; 
      </script>
    `); 
    }
    const {userEmail,userPassword}=req.body
    const loginUser=await User.findOne({ userEmail:userEmail,
        userPassword:userPassword })
        console.log(loginUser.roles);
        
    if(!loginUser) return res.status(404).send(`
      <script>
        alert('User not found');
        window.location.href = '/'; // 
      </script>
    `);
    const token = setUser(loginUser);
    res.cookie("uid",token,{
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
      })
    if(loginUser.roles==="Admin"){
       return res.redirect("/adminDash")}
       else{
    return res.redirect("/dashboard" )}
}
async function handleAdminDash(req,res) {
   const user=req.user
    const users= await User.find({roles:"User"})
       const completedTasks=user.tasks.filter(task=>task.status === "Completed")
        const pendingTasks=user.tasks.filter(task=>task.status === "Pending")
    return res.render("adminDash",{
        userEmail:user.userEmail,
        userName:user.userName,
        tasks:user.tasks,
        completedTasks:completedTasks,
        pendingTasks:pendingTasks,
        users
    })
}
async function handleUserDashboard(req,res) {
    const user=req.user
    
    const completedTasks=user.tasks.filter(task=>task.status === "Completed")
        const pendingTasks=user.tasks.filter(task=>task.status === "Pending")
    return res.render("dashboard",{
        userEmail:user.userEmail,
        userName:user.userName,
        tasks:user.tasks ,
        completedTasks:completedTasks,
        pendingTasks:pendingTasks,
    })
}
async function HandleRegisterUser(req,res) {
    const body=req.body
    // console.log(body);
    
    const {userEmail,userName,userPassword}=req.body
    if( body.userEmail==="" || body.userName==="" || body.userPassword===""){
        return res.status(404).send('Enter all details');
    }
    User.create({
        userName,
        userEmail,userPassword
    })
    return res.send(`
      <script>
        alert('User Registeresd');
        
      </script>
    `)
}
async function handleAddTask(req,res) {
    const body=req.body;
    const user=req.user
   const task= new Tasks({
    taskName:body.taskName,
    taskPriority:body.taskPriority,
    description:body.description,
    dueDate:body.dueDate,
    status:body.status

   })
   req.user.tasks.push(task);
   await req.user.save();
   if(user.roles==="Admin"){
    return res.redirect("/adminDash")
   }
   else{
    return res.redirect("/dashboard")
   }
    console.log('task added');
    
}

async function handleUpdateTask(req,res) {
    console.log(req.user);
    const {taskName,description,status,taskPriority,dueDate}=req.body
    const user = req.user;
    // const task = user.tasks.taskName(req.body.taskName)
    const updatedTask = {};

    if (description) updatedTask["tasks.$.description"] = description;
    if (status) updatedTask["tasks.$.status"] = status;
    if (taskPriority) updatedTask["tasks.$.taskPriority"] = taskPriority;
    if (dueDate) updatedTask["tasks.$.dueDate"] = dueDate;
    if (Object.keys(updatedTask).length === 0) {
        return res.status(400).send("No valid fields provided for update.");
      }
      const result = await User.findOneAndUpdate(
        { userEmail:user.userEmail, "tasks.taskName": taskName }, 
        { $set: updatedTask }, 
        {new:true}                   
      );
      console.log('updated')
      console.log(user.tasks);
      
      res.redirect("/dashboard")
}
async function handleUserLogout(req,res) {
    res.clearCookie("uid"); 
  res.redirect("/"); 
}



async function handleFilters(req, res) {
    try {
      const { status, priority, dueDate } = req.query;
      const user = req.user;
      let filteredTasks = user.tasks;
  
      // Apply filters one after another
      if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
      }
  
      if (priority) {
        filteredTasks = filteredTasks.filter(task => task.taskPriority === priority);
      }
  
      if (dueDate) {
        const formattedDate = new Date(dueDate).toLocaleDateString("en-GB");
        filteredTasks = filteredTasks.filter(task => task.dueDate === formattedDate);
      }
  
      const completedTasks = user.tasks.filter(task => task.status === "Completed");
      const pendingTasks = user.tasks.filter(task => task.status === "Pending");
  
      // Render, not redirect
      res.render("dashboard", {
        userEmail: user.userEmail,
        userName: user.userName,
        tasks: filteredTasks,
        completedTasks,
        pendingTasks,
        status,
        priority,
        dueDate
      });
      console.log("Applied Filters:", { status, priority, dueDate });
      console.log("Filtered Task Count:", filteredTasks.length);
    } catch (err) {
      console.error("Error applying filters:", err);
      res.status(500).send("Internal server error.");
    }
  }
  
module.exports={
    handleLoginUser,
    HandleRegisterUser,
    handleAddTask,
    handleUpdateTask,
    handleUserLogout,
    handleFilters,
    handleAdminDash,
    handleUserDashboard
    
}