const bodyParser = require('body-parser')
const Message = require('./models/message-schema')
const methodOverride = require('method-override')
const mongodbUriString = process.env.MONGODB_URI || 'mongodb://localhost/birdie-bot';
const mongoose = require('mongoose')
const port = process.env.PORT || 2018
const routes = require('./routes')

const express = require('express')
const app = express()

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

mongoose.Promise = global.Promise
mongoose.connect(mongodbUriString, (err, res) => {
    if (err) console.log (`ERROR connecting to: ${mongodbUriString}. Error: ${err}`);
    else console.log (`Successfully connected to: ${mongodbUriString}`);
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('X-HTTP-Method-Override'))

app.use(routes)

app.listen(port, () => console.log(`beep. boop. Scanning port ${port} for wifey...`))