const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user: String,
    room: String,
    message: String,
    time: String
});

const roomSchema = new mongoose.Schema({
    room : String,
    username: String
})

const Msg = mongoose.model('msgSchema', chatSchema);
const Room = mongoose.model('roomSchema', roomSchema);

module.exports = { Room, Msg };