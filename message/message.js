require('mongoose')
const config = require('../config')
const express = require('express')
const Message = require('../models/message-schema')
const twilio = require('twilio')

let sid = process.env.TWILIO_SID || config.twilio.sid
let token = process.env.TWILIO_TOKEN || config.twilio.token
let twilioNumber = process.env.TWILIO_NUMBER || config.twilio.number
 
module.exports = {
    get,
    post,
}

function get (req, res, next) {
    try {

        let client = new twilio(sid, token)
        let recipient = req.query.recipientNumber || 5024188705

        let query = {}
        
        if (req.query.subType) query.subType = req.query.subType
        if (req.query.type) query.type = req.query.type

        Message.aggregate([{$match: query}, { $sample: {size: 1} }],
            (err, result) => {
                
                let message = result[0] ? result[0].text : '<3'
                let prefix = config.twilio.twilioPrefix.randomElement()
                let textBody = `${prefix} ${message}`

                // Send the text message.
                client.messages.create({
                    to: recipient,
                    from: twilioNumber,
                    body: textBody,
                });
                res.send(textBody)
            }
        )

    } catch (err) {
        res.status = err.status || 500
        res.send(err.message)
    }
}

function post (req, res, next) {
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
        res.status = err.status || 500
        res.send(err.message)
    }
}