const Post=require('../Schema/PostSchema')
const User=require('../Schema/UserSchema')
const jwt_decode =require('jwt-decode')

const addNewPost=(req,res,next)=>{ 
    var decoded = jwt_decode(req.body.token);
     let time=req.body.time
     let date=req.body.date
     let userId=decoded.id
     let description=req.body.description
     let postType=req.body.postType
    if(postType=="image"){
        const postImage = [];
        const url = req.protocol + '://' + req.get('host')
        for (var i = 0; i < req.files.length; i++) {
            let images={
                image:url + '/uploads/postImage/' + req.files[i].filename
            }
            postImage.push(images)
        }
         let newPost=new Post({
            time,date,userId,description,postImage,postType
        })
        newPost.save()
            .then(result=>{
                res.json({
                    message:"Post Uploaded Successfully",
                    result
                })
            }).catch(error=>{
                res.json({
                    message:"Server Error Found",
                    error
                })
            })
    }else if(postType=="text"){
        let newPost=new Post({
            time,date,userId,description,postType
        })
        newPost.save()
            .then(result=>{
                res.json({
                    message:"Post Uploaded Successfully",
                    result
                })
            }).catch(error=>{
                res.json({
                    message:"Server Error Found",
                    error
                })
            })
    }
    else if(postType=="video"){
        const url = req.protocol + '://' + req.get('host')
         let videoUrl=url + '/uploads/postVideos/' + req.file.filename
        let newPost=new Post({
            time,date,userId,description,postType,postVideos:videoUrl
        })
        newPost.save()
            .then(result=>{
                res.json({
                    message:"Post Uploaded Successfully",
                    result
                })
            }).catch(error=>{
                res.json({
                    message:"Server Error Found",
                    error
                })
            })
    }
  
}
const getAllPost=(req,res,next)=>{
   Post.find()
        .then(result=>{
            res.json({result})
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        })
}
const getUserSomeDetails=(req,res,next)=>{
    User.findOne({_id:req.params.id})
    .then(result=>{
        res.json({result})
    }).catch(error=>{
        res.json({
            message:"Server Error Found",
            error
        })
    })  
}

const setLike=(req,res,next)=>{
    let id=req.params.postId
    let token=req.body.token
    var decoded = jwt_decode(token);
    let userId=decoded.id

     let newLikes={
        userId,
        like:"like"
    }
    Post.updateOne({_id:id},{$push:{likes:newLikes}})
        .then(result=>{
            res.json({result})
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        }) 




}
const cancelLike=(req,res,next)=>{
    let id=req.params.postId
    let token=req.body.token
    var decoded = jwt_decode(token);
    let userId=decoded.id
    Post.updateOne({ _id: id }, { $pull: { "likes": {userId} } }, { safe: true, upsert: true })
        .then(result=>{
            res.json({result})
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        }) 
}

const setComment=(req,res,next)=>{
    let id=req.params.postId
    let token=req.body.token
    var decoded = jwt_decode(token);
    
    let comment=req.body.comment

    let newComment={
        userId:decoded.id,
        comment
    }
    Post.updateOne({_id:id},{$push:{comments:newComment}})
        .then(result=>{
            res.json({result})
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        }) 

}
const cancelComment=(req,res,next)=>{
    let id=req.params.postId
     let token=req.body.token
    var decoded = jwt_decode(token);
    let userId=decoded.id

    Post.updateOne({ _id: id }, { $pull: { "comments": {userId} } }, { safe: true, upsert: true })
        .then(result=>{
            res.json({result})
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        }) 
}


const getAllPostLikes=(req,res,next)=>{
    Post.findOne({_id:req.params.postId},{likes:1})
        .then(likes=>{
            res.json({
                likes
            })
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        }) 
}



const getAllPostComments=(req,res,next)=>{
    Post.findOne({_id:req.params.postId},{comments:1})
        .then(comments=>{
            res.json({
                comments
            })
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        }) 
}

const getUserPost=(req,res,next)=>{
    Post.find({userId:req.params.userId})
        .then(result=>{
            res.json({
                result
            })
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        })
}


module.exports={
    addNewPost,
    getAllPost,
    getUserSomeDetails,
    setLike,
    cancelLike,
    setComment,
    cancelComment,
    getAllPostLikes,
    getAllPostComments,
    getUserPost
}