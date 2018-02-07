const bodyParser = require('body-parser')
const http = require('http')
const Message = require('./models/message-schema')
const methodOverride = require('method-override')
const mongodbUriString = process.env.MONGODB_URI || 'mongodb://localhost/birdie-bot';
const mongoose = require('mongoose')
const port = process.env.PORT || 2018
const routes = require('./routes')

const express = require('express')
const app = express()

// config file is only present for local testing
let config
try {
    config = require('../config')
} catch (err) {
    console.log('whooper doop. scanning environmental variables...')
}


setInterval(function() {
    if (sendMessageCheck()) {
        http.get(`http://birdie-bot.herokuapp.com/message/?recipientNumber=${process.env.DEFAULT_NUMBER || config.defaultNumber}`)
    } else {
        http.get('http://birdie-bot.herokuapp.com/healthcheck')
    }
}, 300000)

function sendMessageCheck() {
    // Check if hours are outside when it should be sent
    let now = new Date()
    let hour = now.getUTCHours()
    if (hour >= 8 && hour <= 16)
        return false

    // If random number is 99, send the message
    let randInt = Math.floor(Math.random() * Math.floor(100))
    if (randInt == 99)
        return true
    else
        return false
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