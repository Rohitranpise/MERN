require("dotenv").config();
require("./db/db.config")
const express = require("express")
const app = express();
const PORT = process.env.PORT;

//router
const userRouter = require("./routes/user.routes")


app.use(express.json())
app.get("/", (req, res) => {
    res.send(`this is home`)
});

app.use("/user", userRouter)

app.listen(PORT, () => {
    console.log(`server started on the port ${PORT}`)
})