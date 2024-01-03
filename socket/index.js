
const io=require("socket.io")(8900,{
    cors:{
        origin: "http://localhost:3000"
    }
})

let users=[]
const addUser=(userId,socketId)=>{
    !users.some(user=>user.userId===userId) &&
    users.push({userId,socketId})
}

const removeUser=(socketId)=>{
    users=users.filter(user=>user.socketId !==socketId)
}

// tìm người người dùng
const getUser=(userId)=>{
    return users.find(user=>user.userId===userId)
}

io.on("connection",(socket)=>{
    // when connect
    console.log("a user connected")
    //take userId and socketId from user
    // lắng nghe từ máy khách về người dùng
    socket.on("addUser",userId=>{
        addUser(userId,socket.id)
        // gửi thông báo người dùng cho máy khách
        io.emit("getUser",users)
    })

    //send and get message
    // lắng nghe từ máy khách về phòng chát
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        const user=getUser(receiverId)
        // gửi tin nhắn đến người dùng cụ thể
        io.to(user.socketId).emit("getMessage",{
            senderId,
            text
        })
    })

    //when disconnect   
    socket.on("disconnect",()=>{
        console.log("a user disconnected")
        // xóa ng dùng khỏi nhóm chat
        removeUser(socket.id)
        io.emit("getUser",users)

    })
})