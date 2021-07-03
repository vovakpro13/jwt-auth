const mongoose = require('mongoose');

const { config } = require('../constants');

mongoose.connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

module.exports.models = require('./models');