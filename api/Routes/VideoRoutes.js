const express=require("express")
const multer=require("multer")
const { v4: uuidv4 } = require('uuid');
const router=express.Router()
const videoController=require('../Controller/VideoController')
const postController=require('../Controller/PostController')



const storage=multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'./uploads/postVideos')
    },
    filename:function(req,file,cb){
        console.log(file)
        cb(null, uuidv4()+uuidv4() + file.originalname)
    }
})
const upload=multer({storage:storage})


router.post('/',upload.single("postVideos"),postController.addNewPost)
router.get('/all/',videoController.getAllVideos)

module.exports=router