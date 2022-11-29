const { default: axios } = require("axios");
const { io } = require("../../../app");
const { ActivatedUser } = require("../models/activateuser");
const { UserModel } = require("../models/users");



let users = []
io.on('connection', socket => {
    console.log(socket.id);
    socket.on('ready_for_chat', async (userID) => {
        console.log("user..id", userID);
        let result = await UserModel.aggregate([{
            $lookup: {
                from: 'kidsinfos',
                localField: '_id',
                foreignField: 'userId',
                as: 'kidsInformation'
            }
        }])
        result = result?.filter(item => item?._id?.toString() !== userID)
        socket.emit('recieve_all_user', result)
    })
})