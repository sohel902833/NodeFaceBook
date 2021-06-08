const express=require('express')
const router=express.Router()
const friendController=require('../Controller/FriendsController')


router.post('/req',friendController.sendFriendRequest)
router.post('/reqC',friendController.cancelFriendReq)
router.post('/',friendController.acceptFriendReq)
router.post('/rem',friendController.removeFriends)
router.get('/:id',friendController.getUserFriends)
router.get('/req/:id',friendController.getUserFriendRequestList)

module.exports=router