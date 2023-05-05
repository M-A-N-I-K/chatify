import express from "express";
const app = express();

import http from "http";
import cors from "cors"
import puppeteer from "puppeteer";
import { Blob } from "buffer";

app.use(cors());

import { Server } from "socket.io"


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
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
        console.log(`User Offline ${socket.id}`);
    })
})


server.listen(3000, () => {
    console.log("Server is running on port 3000");
})