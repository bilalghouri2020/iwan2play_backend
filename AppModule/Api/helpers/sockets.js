const { io } = require("../../../app");

let users = []
io.on('connection', (socket) => {
    console.log('user connected...', socket.id);
    users.push(socket.id)
    socket.on('disconnect', () => {
        users = users.filter(item => item !== socket.id)
        console.log('user disconnected...', socket.id);
    })
    socket.on('get_user_response', (data) => {
        console.log('data from user....', data, '...socketID..', socket.id  );
        console.log('all users....',users );
    })
})