const  nodemailer = require('nodemailer');

const { config } = require('../constants');

class MailService{
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.SMPT_HOST,
            port: config.SMPT_PORT,
            secure: false,
            auth: {
                user: config.SMPT_USER,
                pass: config.SMPT_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: config.SMPT_USER,
            to,
            subject: `Активація акаунта на ${config.API_URL}`,
            text: '',
            html: `
                <div><h3>Для підтвердження перейдіть <a href="${link}">за цим посиланням</a>:</h3></div>
                
            `
        });
    }
}

module.exports = new MailService();