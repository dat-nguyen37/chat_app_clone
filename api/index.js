const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const helmet=require('helmet')
const morgan=require('morgan')
const userRouter=require('./routers/users')
const authRouter=require('./routers/auths')
const postRouter=require('./routers/posts')
const conversationRouter=require('./routers/conversation')
const messageRouter=require('./routers/message')


const multer=require('multer')
const path=require('path')


dotenv.config()
async function connect(){
    try {
        await mongoose.connect(process.env.MONGOOSE_URL)
        console.log("Connected to Mongoose");
        
    } catch (error) {
        console.error('Error connecting to Mongoose:', error.message);
    }
}
connect()

app.use("/images",express.static(path.join(__dirname, "public/images")))

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        return cb(null, "public/images")
    },
    filename:(req,file,cb)=>{
        return cb(null, req.body.name)
    }
})
const upload=multer({storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try {
        return res.status(200).json("File uploaded successfully")
    } catch (err) {
        console.log(err)
    }
})

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/post',postRouter)
app.use('/api/conversation',conversationRouter)
app.use('/api/message',messageRouter)






app.listen(8800,()=>{
    console.log("backend server is running")
})