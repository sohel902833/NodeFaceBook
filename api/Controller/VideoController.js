const Post=require('../Schema/PostSchema')


const  saveNewVideo=(req,res,next)=>{
    
}
const getAllVideos=(req,res,next)=>{
   
    Post.find({postType:"video"})
        .then(result=>{
           res.json({result})
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        })
}
module.exports={
    saveNewVideo,
    getAllVideos
}





