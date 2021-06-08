const mongoose=require('mongoose')
const Schema=mongoose.Schema


const friendsSchema=new Schema({

    userId:String,
    friends:[
        {
            friendsId:String,
            date:String
        }
    ]
    

})
const  Friends=mongoose.model('friends',friendsSchema)

module.exports=Friends