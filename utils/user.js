
// function userJoin(username, room){
//     const room = new Room({username, room});

//     room.save().then(()=>{
//         room.find({}).exec(function(records) {
//             records.forEach(function(record) {
//             console.log(record._id);
//           });
//         });
//     })

//     return room;
// }

// function getCurrentUser(id){
//     const roomId = new Room({username, room});

//     return roomId.findById(id);
// }

// exports.module = {userJoin, getCurrentUser};