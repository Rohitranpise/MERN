const mongoose = require("mongoose")
const URI = process.env.URI
mongoose.connect(URI)

const db = mongoose.connection;
db.on('error', () => {
    console.log(`error in connection`)
})
db.once('connected', () => {
    console.log(`connection to db success`)
})