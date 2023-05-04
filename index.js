const express = require("express");
const socketio = require("socket.io");
const http = require("http");
require("dotenv").config();
const PORT = process.env.PORT;
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./users/user");

const { formateMessage } = require("./users/messages");
const { userRouter } = require("./routes/user.route");

const app = express();

app.use(express.json());

app.get("/user", userRouter);

const server = http.createServer(app);

const io = socketio(server);

const botName = "Dheeraj";

io.on("connection", (socket) => {
  console.log("Hii There, From the server");

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit(
      "message",
      formateMessage(botName, "Welcome to chat app server")
    );

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formateMessage(botName, `${user.username} has joined the group`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formateMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    io.to(user.room).emit(
      "message",
      formateMessage(botName, `${user.username} has left the group`)
    );
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
