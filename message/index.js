const router = require('express').Router()
const Message = require('./message')

router.get('/', Message.get)
router.post('/', Message.post)

module.exports = router