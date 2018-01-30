require('mongoose')
const express = require('express')
const Message = require('../models/message-schema')
const Prefix = require('../models/prefix-schema')
const twilio = require('twilio')

// config file is only present for local testing
let config
try {
    config = require('../config')
} catch (err) {
    console.log('whooper doop. scanning environmental variables...')
}

let sid = process.env.TWILIO_SID || config.twilio.sid
let token = process.env.TWILIO_TOKEN || config.twilio.token
let twilioNumber = process.env.TWILIO_NUMBER || config.twilio.twilioNumber
 
module.exports = {
    getPrefix,
    getTextBody,
    postPrefix,
    postTextBody,
    sendCompliment,
}

function getPrefix (req, res, next) {
    try {        
        let query = {}
        
        query.subType = req.query.subType ? req.query.subType : {$ne: 'introduction'}
        query.type = req.query.type ? req.query.type : {$ne: 'introduction'}

        Prefix.aggregate([{$match: query}, { $sample: {size: 2} }],
            (err, result) => {
                req.query.prefix = result[0].text < result[1].text ? result[0].text : result[1].text
                next()
            }
        )
    } catch (err) {
        errorHandler(err)
    }
}

function getTextBody (req, res, next) {
    try {
        let query = {}
        
        query.subType = req.query.subType ? req.query.subType : {$ne: 'introduction'}
        query.type = req.query.type ? req.query.type : {$ne: 'introduction'}

        Message.aggregate([{$match: query}, { $sample: {size: 2} }],
            (err, result) => {
                req.query.textBody = result[0].text < result[1].text ? result[0].text : result[1].text
                next()
            }
        )
    } catch (err) {
        errorHandler(err)
    }
}



function sendCompliment (req, res, next) {
    try {
        let client = new twilio(sid, token)
        let recipient = req.query.recipientNumber

        let prefix = req.query.prefix
        let textBody = req.query.textBody
        let message = `${prefix}\n...\n...\n\n${textBody}`

        let twilioMessage = {
            body: message,
            from: twilioNumber,
            to: recipient,
        }

        client.messages.create(twilioMessage)
        res.send(textBody)

    } catch (err) {
        errorHandler(err)
    }
}



function postPrefix (req, res, next) {
    try {
        if (!req.body.text) throw new Error('beep. beep. beep. request must contain message')

        let subType = req.body.subType || 'general'
        let text = req.body.text
        let type = req.body.type || 'general'

        let prefix = new Prefix({
            subType: subType,
            text: text,
            type: type,
        })

        prefix.save( (err) => {
            if (err) throw new Error(err.message)   
            res.send('beep. boop. new message for wifey saved.')
        })

    } catch (err) {
        errorHandler(err)
    }
}


function postTextBody (req, res, next) {
    try {
        if (!req.body.text) throw new Error('beep. beep. beep. request must contain message')

        let subType = req.body.subType || 'general'
        let text = req.body.text
        let type = req.body.type || 'general'

        let message = new Message({
            subType: subType,
            text: text,
            type: type,
        })

        message.save( (err) => {
            if (err) throw new Error(err.message)
            res.send('beep. boop. new message for wifey saved.')
        })

    } catch (err) {
        errorHandler(err)
    }
}


function errorHandler (err) {
    res.status = err.status || 500
    res.send(err.message)
}