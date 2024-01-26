const path=require("path");
const http=require("http");
const express=require('express');
const socketio=require('socket.io');
const { Socket } = require("net");
const { randomInt } = require("crypto");

let nicknames = {}


const app=express();
const server=http.createServer(app);
const io=socketio(server);


const port=process.env.PORT || 3000;
const publicDirectoryPath=path.join(__dirname,"/public");

app.use(express.static(publicDirectoryPath));


io.on("connection",(client)=>{
  // let nickname = randomInt(1,10)
  client.on("setNickname", (nickname)=>{
    nicknames[client.id] = nickname
    io.emit("addUser", nickname, nicknames)
    io.emit("Hello", nicknames[client.id])
  })

  
  
     
    console.log('New websocket connection');
 client.on('messageFromClient', (msg, nickname, color) => {
    io.emit('messageFromServer', msg, nickname, color);
  });
   client.on('disconnect', () => {
    io.emit("deleteUser", nicknames[client.id])
    delete nicknames[client.id]
    
    

    console.log('New websocket disconnected');
  });
})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`);
})