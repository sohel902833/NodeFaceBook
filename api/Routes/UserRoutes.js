const express=require('express')
const router=express.Router()
const userController=require("../Controller/UserController")


router.post('/register',userController.registerUser)
router.post('/login',userController.loginUser)
router.get('/',userController.getAllUser)
router.get('/:userId',userController.getSingleUser)



module.exports=router