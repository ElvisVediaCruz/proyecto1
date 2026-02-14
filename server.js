import app from './src/app.js';
import http from 'http';
import { PORT, NODE_ENV } from './src/config/env.js';
import { Server } from 'socket.io';

const aplicationServer = http.createServer(app);
const io = new Server(aplicationServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on("connection", (socket) =>{
    console.log("New user connected");
    socket.on("barcode", (code) => {
        io.emit("barcode", code);
    })
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
})


aplicationServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});