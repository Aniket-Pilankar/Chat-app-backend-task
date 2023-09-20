require('dotenv').config()
const express = require('express');
const connect = require('./server/configs/db');
const { registerUser, loginUser } = require('./server/controllers/user.controller');

const app = express();
app.use(express.json());

app.post("/user/signUp", registerUser);
app.post("/user/loginIn", loginUser);

const PORT = process.env.PORT || 4003;

app.listen(PORT, async() => {
    try {
        const mongoConnection = await connect();
        console.log(`Listening to port ${PORT}`);
        console.log(`MongoDb is connected to ${mongoConnection.connection.host}`)
    } catch (error) {
        console.log('error:', error)
        
    }
})