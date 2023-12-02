require("dotenv").config();
const express = require("express")
const app = express();
const PORT = process.env.PORT;


app.get("/", (req, res) => {
    res.send(`this is home`)
});

app.listen(PORT, () => {
    console.log(`server started on the port ${PORT}`)
})