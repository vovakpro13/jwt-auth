require('dotenv').config();

module.exports = {
    API_URL: process.env.API_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    DB_URL: process.env.DB_URL,
    PORT:  process.env.PORT,
    JWT_ACCESS_SECRET:  process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET:  process.env.JWT_REFRESH_SECRET,
    SMPT_HOST:  process.env.SMPT_HOST,
    SMPT_PORT:  process.env.SMPT_PORT,
    SMPT_USER:  process.env.SMPT_USER,
    SMPT_PASSWORD:  process.env.SMPT_PASSWORD,
}