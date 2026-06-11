const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))

app.get("/",(req,res)=>{
    res.send("hello to the api")
})

module.exports = app;
