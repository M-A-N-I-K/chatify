import { express } from "express";
const app = express();

import http from "http";
import cors from "cors"

app.use(cors());

import { Server } from "socket.io"


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://chatify-app-static.netlify.app",
        methods: ["GET", "POST"],
    }
})

io.on("connection", (socket) => {
    console.log(`User connected with ${socket.id}`);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with id ${socket.id} joined room : ${data}`);
    })
    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("recieve_message", data);
    })
    socket.on("disconnect", () => {
        console.log(`User Offline ${socket.id}`);
    })
})


server.listen(3000, () => {
    console.log("Server is running on port 3000");
})