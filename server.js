require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const connect = require("./server/configs/db");

const {
  registerUser,
  loginUser,
} = require("./server/controllers/auth.controller");
const userController = require("./server/controllers/user.controller");
const chatRoutes = require("./server/routes/chatRoutes");
const messageRoutes = require("./server/routes/messageRoutes");

app.post("/user/signUp", registerUser);
app.post("/user/loginIn", loginUser);

app.use("/api/user", userController);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 4003;

const server = app.listen(PORT, async () => {
  try {
    const mongoConnection = await connect();
    console.log(`Listening to port ${PORT}`);
    console.log(`MongoDb is connected to ${mongoConnection.connection.host}`);
  } catch (error) {
    console.log("error:", error);
  }
});

const io = require("socket.io")(server, {
  // pingTimeout: 60000,
  cors: {
    // origin: "http://localhost:3001", // Port Frontend
    origin: [
      "https://chat-app-frontend-task.vercel.app",
      // "http://localhost:3000",
    ], // Port Frontend
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    console.log("setup", userData._id);
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
