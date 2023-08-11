const express = require('express');
const mongoose = require("mongoose");
const songRouter = require('./routes/songs');
const userRouter = require('./routes/user');
require('dotenv').config();

console.log(process.env.MONG_URL)
const app = express()
mongoose.connect(process.env.MONG_URL)
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log('connected and listening');
        });
    }).catch(err => console.log(err.message))

// middleware to log to console
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
}); 

app.use(express.json());

app.use("/api/song", songRouter);
app.use("/api/user", userRouter);
