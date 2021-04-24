const moment = require('moment');

function chats( user, room, message){
    return {
        user,
        room,
        message,
        time : moment().format('h:mm a')
    }
}
function serverMessage( user, message ){
    return {
        user,
        message
    }
}
module.exports = {chats, serverMessage};