const { Schema, model } = require('mongoose');

const { dbTables } = require('../../constants');

const userSchema = new Schema({
    name:{
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    activationLink: {
        type: String
    }
}, { timestamps: true , toJSON: { virtuals: true }});

module.exports = model(dbTables.USER, userSchema);