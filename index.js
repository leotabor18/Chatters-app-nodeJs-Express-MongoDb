const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const {chats, serverMessage} = require('./utils/util');
const mongoose = require('mongoose');
const { Room, Msg } = require('./utils/schema');
require('dotenv').config();

mongoose.connect(process.env.URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=>{ console.log('connected to database..');
}).catch(err =>{ console.log(err) });


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT ||  5500; 
app.use(express.static(path.join(__dirname, 'public')));


io.on('connection' , socket =>{
    socket.on('user', user =>{
        const room = user.room;
        const username = user.username;

        const roomSchema = new Room({room, username})
        Room.findOne({room, username}).then(result=>{
            if(result != null){ 
                socketEmitMessage(result, socket)
            }else{
                roomSchema.save().then(result =>{
                    socketEmitMessage(result, socket)
                })
            }
        });
        socket.on('disconnect', ()=>{
            Room.deleteOne({username}).then(()=>{
                Room.find({room}).then(res =>{
                    const users = [];
                   res.forEach(element => {
                       users.push(element.username);
                   });
                    const roomInfo = {
                        room: room,
                        users: users
                    }
                    io.to(room).emit('roomInfo', roomInfo);
                });
            });
            io.to(room).emit('message',  serverMessage( username, `${username} has left the chat`));
        });

    });
    
});


function socketEmitMessage(result, socket){
    socket.join(result.room);
    //Welcome message
    socket.emit('message',  serverMessage(result.username ,'Welcome to Chatters app'));
    Msg.find({room: result.room}).then(res =>{
        if(res != 0){
            res.forEach(element => {
                socket.emit('chat-message', element);
            });
        }
    });
    //emit to everybody except to users
    socket.broadcast
        .to(result.room)
        .emit(
            'message', 
            serverMessage(result.username,`${result.username} has join the chat`)
        );
    Room.find({room: result.room}).then(res =>{
        const users = [];
       res.forEach(element => {
           users.push(element.username);
       });
        const roomInfo = {
            room: result.room,
            users: users
        }
        io.to(result.room).emit('roomInfo', roomInfo);
    });
   
    socket.on('chat', chat =>{
        const chatMessage = chats(result.username, result.room, chat);
        const messageSchema = new Msg(chatMessage);
        messageSchema.save().then(()=>{
            io.to(result.room).emit('chat-message', chatMessage);
        })
    });
}

server.listen(PORT, () => console.log(`Server start at port ${PORT}`));

