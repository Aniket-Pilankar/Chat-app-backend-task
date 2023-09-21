require('dotenv').config()
const express = require('express');

const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())

const connect = require('./server/configs/db');

const { registerUser, loginUser } = require('./server/controllers/auth.controller');
const userController = require('./server/controllers/user.controller')
const chatRoutes = require("./server/routes/chatRoutes");
const messageRoutes = require("./server/routes/messageRoutes");

app.post("/user/signUp", registerUser);
app.post("/user/loginIn", loginUser);

app.use('/api/user', userController);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 4003;

app.listen(PORT, async () => {
    try {
        const mongoConnection = await connect();
        console.log(`Listening to port ${PORT}`);
        console.log(`MongoDb is connected to ${mongoConnection.connection.host}`)
    } catch (error) {
        console.log('error:', error)

    }
})