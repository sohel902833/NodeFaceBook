const mongoose=require("mongoose")

const Schema=mongoose.Schema

const postSchema=new Schema({
    time:{
        type:String,
        default:"0"
    },
    date:{
        type:String,
        default:"0"
    },
    userId:{
        type:String,
        required:true
    },
    postType:String,
    postVideos:String,
    postImage:[{
        image:{
            type:String,
            default:"none"
        }
    }],
    description:String,
    likes:[{
        userId:{
            type:String
         },
        like:String
    }],
    comments:[{
        userId:{
            type:String
        },
        comment:String
    }]
})
const Post=mongoose.model("posts",postSchema)
module.exports=Post



