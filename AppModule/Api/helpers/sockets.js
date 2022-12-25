// const { default: axios } = require("axios");
const { io } = require("../../../app");
// const { ActivatedUser } = require("../models/activateuser");
// const { UserModel } = require("../models/users");
const {jwtVerify} = require('./authHelper')

let count = 0



io.use(async(socket, next) => {
    console.log('socket...', socket.handshake.headers.authorization.split(' ')[1]);
    let result = await jwtVerify(socket.handshake.headers.authorization.split(' ')[1])
    console.log('socket id...', result);
    next()
})


io.on('connection', (socket) => {
        console.log('connection successful...',socket.id);
})

// let users = []
// io.on('connection', socket => {

//     console.log('hello world', socket.id);
// //     users.push({
// //         sockedID: socket.id,
// //     })
// //     console.log('existing users...', users);
// //     socket.on('disconnect', () => {
// //         users = users.filter(item => item.sockedID !== socket.id)
// //         console.log('remaining users...', users);
// //     })
// //     socket.on('ready_for_chat', async (userID) => {
// //         let result = await UserModel.aggregate([{
// //             $lookup: {
// //                 from: 'kidsinfos',
// //                 localField: '_id',
// //                 foreignField: 'userId',
// //                 as: 'kidsInformation'
// //             }
// //         }])
// //         result = result?.filter(item => item?._id?.toString() !== userID)
// //         socket.emit('recieve_all_user', result, users)
// //     })
// })
