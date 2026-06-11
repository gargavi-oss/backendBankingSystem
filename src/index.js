const app = require("./app.js");
const connectDB = require("./db/index.js");
const dotenv = require('dotenv')

dotenv.config();


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`Server is running at : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed: ",err);
})




app.listen()