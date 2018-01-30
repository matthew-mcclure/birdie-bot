const router = require('express').Router()
const Message = require('./message')

router.get('/', Message.getPrefix, Message.getTextBody, Message.sendCompliment)
router.post('/prefix', Message.postPrefix)
router.post('/text', Message.postTextBody)

module.exports = router