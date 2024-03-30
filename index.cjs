const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"] 
    }
});

app.use(cors());

const PORT = process.env.PORT || 7001;

app.get("/", (req, res) => {
    res.send('Server is running.');
});

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit("callended");
    });

    socket.on('calluser', ({ userTocall, signalData, from, name }) => {
     console.log(name , from,userTocall);

        io.to(userTocall).emit("calluser", { signal: signalData, from, name });
        
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
