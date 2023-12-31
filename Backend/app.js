require("dotenv").config();
require("./db/db.config")
const express = require("express")
const app = express();
const PORT = process.env.PORT;
const CORS = require("cors")


//router
const userRouter = require("./routes/user.routes")
const chatRouter = require("./routes/chat.routes")


app.use(express.json())
app.get("/", (req, res) => {
    res.send(`this is home`)
});

//cors
app.use(CORS())

//routing
app.use("/user", userRouter)
app.use("/chats", chatRouter)

app.listen(PORT, () => {
    console.log(`server started on the port ${PORT}`)
})