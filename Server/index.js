import express from "express";
const app = express();

import http from "http";
import cors from "cors"
import puppeteer from "puppeteer";

app.use(cors());

import { Server } from "socket.io"


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        methods: ["GET", "POST"],
    }
})

const users = [];

io.on("connection", (socket) => {
    console.log(`User connected with ${socket.id}`);

    socket.on("join_room", (data) => {
        console.log(data);
        socket.join(data.roomNumber);
        console.log(`User with id ${socket.id} joined room : ${data.roomNumber}`);
        users[socket.id] = data.username;
        console.log(data);
        console.log(users[socket.id]);
        socket.to(data.roomNumber).emit("user_joined", data.username);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("recieve_message", data);
    })

    socket.on("preview", async (url) => {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url);
        const screenshot = await page.screenshot({ type: 'png' });
        let binary = Buffer.from(screenshot, 'binary');
        let base64 = binary.toString('base64');
        socket.emit("previewImage", base64);
        await browser.close();

    })

    socket.on("disconnect", () => {
        socket.broadcast.emit("user_left", users[socket.id]);
        console.log(`User Offline ${socket.id}`);
        delete users[socket.id];
    })
})


server.listen(3000, () => {
    console.log("Server is running on port 3000");
})