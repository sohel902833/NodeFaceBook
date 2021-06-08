const FriendsSchema=require('../Schema/FriendsSchema')
const jwt_decode =require('jwt-decode')
const Friends =require('../Schema/Friends')

const sendFriendRequest=(req,res,next)=>{
    const token=req.body.token
    let {receiverUserId}=req.body
    var decoded = jwt_decode(token);
 
    let updateReceivedId={
        reqUserId:decoded.id,
        reqType:"received"
    }
    let updateSentId={
        reqUserId:receiverUserId,
        reqType:"sent"
    }
    let newReqReceived=new FriendsSchema.FriendRequest({
        userId:receiverUserId,
        reqIds:{
            reqUserId:decoded.id,
            reqType:"received"
        }
    })
    let newReqSent=new FriendsSchema.FriendRequest({
        userId:decoded.id,
        reqIds:{
            reqUserId:receiverUserId,
            reqType:"sent"
        }
    })

    
    FriendsSchema.FriendRequest.findOne({userId:receiverUserId})
        .then(result=>{
            if(result==null){
               newReqReceived.save()
                .then(resu=>{
                 //add new User Received Node
                   FriendsSchema.FriendRequest.findOne({userId:decoded.id})
                        .then(result2=>{
                            console.log(result2)
                            if(result2==null){
                             //add new User Sent Node   
                                   newReqSent.save()
                                        .then(result=>{
                                            res.json({
                                                message:"Friend Request sent",
                                                result
                                            })
                                        })
                                
                                    }else{
                                    //update User Sent 
                                  FriendsSchema.FriendRequest.updateOne({userId:decoded.id},{$push:{reqIds:updateSentId}})
                                        .then(result=>{
                                            res.json({
                                                message:"Friend Request sent"
                                            })
                                        })
                                
                                }
                        }).catch(error=>{
                            res.json({
                                message:"Server Error Found",
                                error
                            })
                       }) 
                })
             
            }else{
           //update User Received Node
                FriendsSchema.FriendRequest.updateOne({userId:receiverUserId},{$push:{reqIds:updateReceivedId}})
                .then(result=>{
                    FriendsSchema.FriendRequest.findOne({userId:decoded.id})
                    .then(result2=>{
                        if(result2==null){
                      //add new User Sent Node   
                           newReqSent.save()
                                .then(result=>{
                                     res.json({
                                        message:"Friend Request sent",
                                        result
                                    })
                                })
                           
                            }else{
                            //update User Sent 
                           FriendsSchema.FriendRequest.updateOne({userId:decoded.id},{$push:{reqIds:updateSentId}})
                                .then(result=>{
                                     res.json({
                                        message:"Friend Request sent"
                                    })
                                }).catch(error=>{
                                    res.json({
                                        message:"Server Error Found",
                                        error
                                    })
                                }) 
                           
                        }
                    }).catch(error=>{
                        res.json({
                            message:"Server Error Found",
                            error
                        })
                    }) 

                })
            }
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        })    

}
const cancelFriendReq=(req,res)=>{
    const token=req.body.token
    let {receiverUserId}=req.body
    var decoded = jwt_decode(token);

    FriendsSchema.FriendRequest.updateOne({userId:receiverUserId},{$pull:{"reqIds":{reqUserId:decoded.id}}})
        .then(result=>{
                FriendsSchema.FriendRequest.updateOne({userId:decoded.id},{$pull:{"reqIds":{reqUserId:receiverUserId}}})
                .then(result=>{
                    res.json({
                        message:"Friend Req Canceled",
                        result
                    })
            }).catch(error=>{
                res.json({
                    message:"Server Error Found",
                    error
                })
            }) 
        })
 
}
const removeFriends=(req,res)=>{
    const token=req.body.token
    let {receiverUserId}=req.body
    var decoded = jwt_decode(token);

    Friends.updateOne({userId:receiverUserId},{$pull:{"friends":{friendsId:decoded.id}}})
        .then(result=>{
                Friends.updateOne({userId:decoded.id},{$pull:{"friends":{friendsId:receiverUserId}}})
                .then(result=>{
                    res.json({
                        message:"Friend Removed",
                        result
                    })
            }).catch(error=>{
                res.json({
                    message:"Server Error Found",
                    error
                })
            }) 
        })
 
}
const acceptFriendReq=(req,res)=>{
    const token=req.body.token
    let {receiverUserId,currentDate}=req.body
    console.log(receiverUserId)
    var decoded = jwt_decode(token);

    let newFriends=new Friends({
        userId:decoded.id,
        friends:{
            friendsId:receiverUserId,
            date:currentDate
        }
    })
    let updateFriends={
        friendsId:receiverUserId,
        date:currentDate 
    }

    let newFriends2=new Friends({
        userId:receiverUserId,
        friends:{
            friendsId:decoded.id,
            date:currentDate
        }
    })
    let updateFriends2={
        friendsId:decoded.id,
        date:currentDate 
    }

    console.log(`sender userID: ${decoded.id}`)
    console.log(`Receiver User Id : ${receiverUserId}`)

    Friends.findOne({userId:decoded.id})
        .then(result=>{
            if(result==null){
                //d
               newFriends.save()
                    .then(result=>{
                       Friends.findOne({userId:receiverUserId})
                            .then(result2=>{
                                if(result2==null){
                                    //d
                                    newFriends2.save()
                                        .then(result=>{
                                            FriendsSchema.FriendRequest.updateOne({userId:receiverUserId},{$pull:{"reqIds":{reqUserId:decoded.id}}})
                                            .then(result=>{
                                                    FriendsSchema.FriendRequest.updateOne({userId:decoded.id},{$pull:{"reqIds":{reqUserId:receiverUserId}}})
                                                    .then(result=>{   
                                                        res.json({
                                                            
                                                            message:"Friend Request Accepted",
                                                            result
                                                        })
                                                }).catch(error=>{
                                                    res.json({
                                                        message:"Server Error Found",
                                                        error
                                                    })
                                                }) 
                                            })
                                        }).catch(error=>{
                                            res.json({
                                                message:"Server Error Found",
                                                error
                                            })
                                        })
                                }else{
                                   Friends.updateOne({userId:receiverUserId},{$push:{friends:updateFriends2}})
                                    .then(result=>{
                                        FriendsSchema.FriendRequest.updateOne({userId:receiverUserId},{$pull:{"reqIds":{reqUserId:decoded.id}}})
                                        .then(result=>{
                                                FriendsSchema.FriendRequest.updateOne({userId:decoded.id},{$pull:{"reqIds":{reqUserId:receiverUserId}}})
                                                .then(result=>{   
                                                    res.json({
                                                        
                                                        message:"Friend Request Accepted",
                                                        result
                                                    })
                                            }).catch(error=>{
                                                res.json({
                                                    message:"Server Error Found",
                                                    error
                                                })
                                            }) 
                                        })
                                    }).catch(error=>{
                                        res.json({
                                            message:"Server Error Found",
                                            error
                                        })
                                    })
                                }
                            }) 
                    }).catch(error=>{
                        res.json({
                            message:"Server Error Found",
                            error
                        })
                    })
            }else{
               Friends.updateOne({userId:decoded.id},{$push:{friends:updateFriends}})
                    .then(result=>{
                        Friends.findOne({userId:receiverUserId})
                        .then(result2=>{
                            if(result2==null){
                                console.log("Create Send")
                                newFriends2.save()
                                    .then(result=>{
                                        FriendsSchema.FriendRequest.updateOne({userId:receiverUserId},{$pull:{"reqIds":{reqUserId:decoded.id}}})
                                        .then(result=>{
                                                FriendsSchema.FriendRequest.updateOne({userId:decoded.id},{$pull:{"reqIds":{reqUserId:receiverUserId}}})
                                                .then(result=>{   
                                                    res.json({
                                                        
                                                        message:"Friend Request Accepted",
                                                        result
                                                    })
                                            }).catch(error=>{
                                                res.json({
                                                    message:"Server Error Found",
                                                    error
                                                })
                                            }) 
                                        })
                                    }).catch(error=>{
                                        res.json({
                                            message:"Server Error Found",
                                            error
                                        })
                                    })
                            }else{
                                Friends.updateOne({userId:receiverUserId},{$push:{friends:updateFriends2}})
                                    .then(result=>{
                                        FriendsSchema.FriendRequest.updateOne({userId:receiverUserId},{$pull:{"reqIds":{reqUserId:decoded.id}}})
                                        .then(result=>{
                                                FriendsSchema.FriendRequest.updateOne({userId:decoded.id},{$pull:{"reqIds":{reqUserId:receiverUserId}}})
                                                .then(result=>{   
                                                    res.json({
                                                        
                                                        message:"Friend Request Accepted",
                                                        result
                                                    })
                                            }).catch(error=>{
                                                res.json({
                                                    message:"Server Error Found",
                                                    error
                                                })
                                            }) 
                                        })
                                    }).catch(error=>{
                                        res.json({
                                            message:"Server Error Found",
                                            error
                                        })
                                    })
                            }
                        }) .catch(error=>{
                            res.json({
                                message:"Server Error Found",
                                error
                            })
                        })
                    })
            }
        }).catch(error=>{
            res.json({
                message:"Server Error Found",
                error
            })
        })




}

const getUserFriends=(req,res)=>{
    Friends.findOne({userId:req.params.id},{friends:1})
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
const getUserFriendRequestList=(req,res)=>{
    FriendsSchema.FriendRequest.findOne({userId:req.params.id},{reqIds:1})
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
    sendFriendRequest,
    removeFriends,
    cancelFriendReq,
    acceptFriendReq,
    getUserFriends,
    getUserFriendRequestList
}