const express=require("express")
const multer=require("multer")

const router=express.Router()
const postController=require('../Controller/PostController')
const storage=multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'./uploads/postImage')
    },
    filename:function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})
const upload=multer({storage:storage,limits:{
    fileSize:1024*1024*100
    }})


router.post('/',upload.array('postImage', 6),postController.addNewPost)
router.get('/',postController.getAllPost)
router.get('/:userId',postController.getUserPost)
router.get('/us/:id',postController.getUserSomeDetails)

//like comment routes

router.post('/like/:postId',postController.setLike)
router.post('/likeC/:postId',postController.cancelLike)
router.post('/comment/:postId',postController.setComment)
router.delete('/comment/:postId',postController.cancelComment)

//get like comment routes

router.get('/like/:postId',postController.getAllPostLikes)
router.get('/comment/:postId',postController.getAllPostComments)









module.exports=router