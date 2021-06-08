
const mongoose=require('mongoose')

const Schema=mongoose.Schema


const UserSchema=new Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    gender:{
        type:String
    },
    dob:{
        type:String
    },
    relationShip:{
        type:String
    },
    profileImage:{
        type:String,
        default:"none"
    }


})


const User=mongoose.model('users',UserSchema)
module.exports=User


