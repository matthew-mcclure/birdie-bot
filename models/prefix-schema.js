var mongoose = require('mongoose')

let PrefixSchema = new mongoose.Schema({
    subType: String,
    text: String,
    type: String,
    usageCount: {type: Number, default: 0},
});

module.exports = mongoose.model('Prefix', PrefixSchema)