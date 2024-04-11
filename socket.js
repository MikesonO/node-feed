let io;

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', socket => {
            console.log('Client connected!');
        });

        return io;
    },

    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialised!');
        }
        return io
    }
};
