import * as dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config({ path: __dirname + '/.env' })

const sendMail = (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const options = {
    from: process.env.EMAIL_SENDER,
    to,
    subject,
    text: message,
  }

  transporter.sendMail(options, (error, info) => {
    if (error) console.log(error)
    else console.log(info)
  })
}

export default sendMail
