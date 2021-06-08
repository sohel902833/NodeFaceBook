const express=require('express')
const morgan=require('morgan')
const bodyParser=require('body-parser')
const cors=require('cors')
const mongoose=require('mongoose')

const  multer=require("multer")

var config = { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify:true}

mongoose.connect('mongodb://localhost/fbTest',config)

const db=mongoose.connection
db.on('error',(err=>{
    console.log(err)
}))
db.once('open',()=>{
    console.log("Database Connected")
})

dotenv.config();
const app=express()
app.use('/uploads/postImage/',express.static("uploads/postImage/"))
app.use('/uploads/postVideos/',express.static("uploads/postVideos/"))
app.use(cors()) 
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


const PORT=process.env.PORT || 4000


app.use('/api/users',require('./api/Routes/UserRoutes'))
app.use('/api/post',require('./api/Routes/PostRoutes'))
app.use('/api/post/video',require('./api/Routes/VideoRoutes'))
app.use('/api/friends',require('./api/Routes/FriendsRoutes'))




app.get('/',(req,res)=>{
    res.json("Md Sohrab Hossain")
})

app.listen(PORT,()=>{
    console.log(`Server is Running on PORT ${PORT}`)
})
