const { Schema, model } = require('mongoose');

const { dbTables } = require('../../constants');

const tokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: dbTables.USER
    },
    refreshToken: {
        type: String,
        required: true
    }
});

module.exports = model(dbTables.TOKEN, tokenSchema);

