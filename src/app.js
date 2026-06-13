const express = require('express');
const app = express();
const cookieParser= require("cookie-parser");
const authRouter= require("./routes/auth.routes.js")
const accountRouter = require("./routes/account.routes.js");
const transactionRouter = require('./routes/transaction.routes.js');

const cors = require('cors');
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))

app.get("/",(req,res)=>{
    res.send("hello to the api")
});

app.use("/api/auth",authRouter);
app.use("/api/accounts",accountRouter);
app.use("/api/transactions",transactionRouter);

module.exports = app;
