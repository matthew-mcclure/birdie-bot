const router = require('express').Router();
const messageRouter = require('./message')

router.use('/message', messageRouter)

router.get('/healthcheck', (req, res, next) => res.send('beep. boop. all good ever here'))

module.exports = router