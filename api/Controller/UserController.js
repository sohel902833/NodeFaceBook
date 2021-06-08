
const User = require("../Schema/UserSchema")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const registerUser=(req,res,next)=>{
   
    let{firstName,lastName,email,password,phone,gender}=req.body

    if(firstName==null){
        res.json({
            message:"Enter Your First Name"
        })
    }else if(lastName==null){
        res.json({
            message:"Enter Your Last Name"
        })
    }else if(email==null){
        res.json({
            message:"Enter Your Email"
        })
    }else if(password==null){
        res.json({
            message:"Enter Your Password"
        })
    }else if(phone==null){
        res.json({
            message:"Enter Your Phone Number"
        })
    }else if(gender==null){
        res.json({
            message:"Enter Your Gender"
        })
    }else{
        bcrypt.hash(password,10,(err,hash)=>{
            if(err){
                res.json({
                    message:"Password  HashingFailed",
                    err
                })
            }
    
            let newUser=new User({
                firstName,lastName,email,password:hash,phone,gender
            })
    
            newUser.save()
                .then(result=>{
                    let user={
                        firstName:result.firstName,
                        lastName:result.lastName,
                        phone:result.phone,
                        email:result.email,
                        id:result._id
                    }
                    let token=jwt.sign(user,"SECRET",{expiresIn:'2h'})
                     res.json({
                         message:"Register Successful",
                         token:`Bearer ${token}`
                     })               
    
                }).catch(err=>{
                    if(err.keyValue.email){
                        res.json({
                            message:"This Email is Already Registered"
                        })
                    }else{
                        res.json({
                            message:"Server Error Found",
                            error:err
                        })
                    }
                })
        })
    }

}


const loginUser=(req,res,next)=>{


    let {email,password} =req.body

    if(email==null){
        res.json({
            message:"Please Enter Your Email"
        })
    }else if(password==null){
        res.json({
            message:"Please Enter Your Password"
        }) 
    }else{
        User.findOne({email})
            .then(user=>{
                    if(user){
                        bcrypt.compare(password,user.password, (err,result)=>{
                            if(err){
                                res.json({
                                    message:"Error Occured"
                                })
                            }

                            if(result){
                                let newUser={
                                    firstName:user.firstName,
                                    lastName:user.lastName,
                                    phone:user.phone,
                                    email:user.email,
                                    id:user._id
                                }
                                let token=jwt.sign(newUser,"SECRET",{expiresIn:'2h'})
                             res.json({
                                    message:"Login Successful",
                                    token:`Bearer ${token}`
                                })
                            }else{
                                res.json({
                                    message:"Login Failed, Password Doesn\'t Match"
                                })
                            }
                    })
                    }else{
                        res.json({
                            message:"User Not Found"
                        })
                    }
            }).catch(err=>{
                res.json({
                    message:"Server Error",
                    error:err
                }) 
            })
    }

}
const getAllUser=(req,res,next)=>{
    // 
    User.find({},{profileImage:1,firstName:1,lastName:1,email:1,phone:1,gender:1})
    .then(result=>{
        res.json({result})
    }).catch(error=>{
        res.json({
            message:"Server Error Found",
            error
        })
    })  
}
const getSingleUser=(req,res,next)=>{
    User.findOne({_id:req.params.userId},{profileImage:1,firstName:1,lastName:1,email:1,phone:1,gender:1})
        .then(result=>{
            res.json({
                result
            })
        }) .catch(error=>{
            res.json({
                error,
                message:"Server Error Found"
            })
        })
}
module.exports={
    registerUser,
    loginUser,
    getAllUser,
    getSingleUser
}