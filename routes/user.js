const express=require("express")
const {restrictToLoginUser}=require("../middlewares/auth")
const User=require("../models/user")
const router=express.Router()
const{handleLoginUser,HandleRegisterUser,handleAddTask,handleUpdateTask,handleUserLogout,handleFilters,handleAdminDash,handleUserDashboard}=require("../controllers/user")

router.get("/",(req,res)=>{
    return res.render("home")
})
router.post("/addTask",restrictToLoginUser,handleAddTask)
router.post("/login",handleLoginUser)
router.get("/adminDash",restrictToLoginUser,handleAdminDash)
router.get("/dashboard", restrictToLoginUser,handleUserDashboard)

router.get("/logout",handleUserLogout)
router.patch("/updateTask",restrictToLoginUser,handleUpdateTask)
router.post("/signup",HandleRegisterUser)
router.get("/filter", restrictToLoginUser, (req, res) => {
    const { status, priority, dueDate } = req.query;
    const user = req.user;
    let filteredTasks = user.tasks;
  
    // Apply filters
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
  
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.taskPriority === priority);
    }
  
    if (dueDate) {
      const inputDate = new Date(dueDate).toISOString().split("T")[0];
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.dueDate).toISOString().split("T")[0];
        return taskDate === inputDate;
      });
    }
  
    const completedTasks = filteredTasks.filter(task => task.status === "Completed");
    const pendingTasks = filteredTasks.filter(task => task.status === "Pending");
  
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
  });
  router.delete("/adminDash/tasks/:taskId",restrictToLoginUser,async(req,res)=>{
    const { taskId } = req.params;
    const deletedTask = await User.tasks._id.findByIdAndDelete(taskId);
    res.render("adminDash")
  })
  
module.exports=router