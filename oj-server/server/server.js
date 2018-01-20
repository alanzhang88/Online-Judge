const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const axios = require("axios");
const path = require("path");
var { router } = require("../router/rest");
var { UserToRoom, Room } = require("../service/room");

const publicPath = path.join(__dirname,"..","..","/public");
var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));


app.use("/api/v1",router);
//catching all the request and resend to angular
app.get("*",(req,res)=>{
  res.sendFile(publicPath+'/index.html');
});


io.on("connection",(socket)=>{
  console.log("User connected ",socket.id);
  socket.on("joinRoom",(email)=>{
    console.log("clients want to join room ", email);

    if(!Room.exist(email)){
      Room.generate(email);
    }
    else{
      Room.incPeopleNum(email);
    }
    UserToRoom.addUser(socket.id,Room.getRoomName(email));
    var curRoomName = Room.getRoomName(email);
    socket.join(curRoomName);

    socket.to(curRoomName).broadcast.emit("newuserJoin",{id:socket.id});
    // clients[socket.id] = socket;

    socket.on("newuserInfo",function(msg){
      console.log("Recv info from a client, sending to the other", msg.id, socket.id);
      // console.log("Recv clients", clients[msg.id]);
      // clients[msg.id].emit("newuserSync",msg);
      io.to(msg.id).emit("newuserSync",msg);
    });

    socket.on("newPatch",function(e){
      console.log("Recv a text change from a client");
      socket.to(curRoomName).broadcast.emit("patchText",e);
    });

    socket.on("newCursorPos",function(msg){
      console.log("Recv new cursor position from a client");
      socket.to(curRoomName).broadcast.emit("cursorPosUpdate",msg);
    });

    socket.on("codeToRun",function(codes){
      console.log("Recv codes to run from client sending to executor");
      axios.request({
        url: "/exec",
        baseURL: "https://secure-refuge-21295.herokuapp.com/",
        method: "post",
        data: codes,
        responseType: "json"
      }).then((response)=>{
        if(response.status === 200){
          console.log("Recv results from executor",response.data);
          io.to(curRoomName).emit("codeResult",response.data);
          //socket.broadcast.emit("codeResult",response.data);
        }
      }).catch((e)=>{
        console.log("Error ",e);
      });
    });

    socket.on("newLang",(msg)=>{
        console.log("a client set a new theme, sending to rest of the client to sync");
        socket.to(curRoomName).broadcast.emit("setLang",msg);
    });

    socket.on("updateRestoration",(msg)=>{
      console.log("a client wants to update others local storage");
      socket.to(curRoomName).broadcast.emit("syncRestoration",msg);
    });

    socket.on("end",(email)=>{

      socket.disconnect(0);
    });

    socket.on("disconnect",()=>{
      console.log("User disconnected");
      // delete clients[socket.id];
      socket.to(curRoomName).broadcast.emit("userdisconnect",{id:socket.id});
      Room.decPeopleNum(email);
      UserToRoom.removeUser(socket.id);
      if(Room.getPeopleNum(email) === 0){
        Room.removeRoom(email);
      }

    });
  });


});


server.listen(port,()=>{
  console.log(`Server start listening on port ${port}`);
});
