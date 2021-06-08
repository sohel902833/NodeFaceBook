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

const friendRequestSchema=new Schema({
    userId:String,
    reqIds:[
        {
            reqUserId:String,
            reqType:String
        }
    ]
})





const  Friends=mongoose.model('userFriends',friendsSchema)
const FriendRequest=mongoose.model('friendRequests',friendRequestSchema)

module.exports={
    Friends,
    FriendRequest
}