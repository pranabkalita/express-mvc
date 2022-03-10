import pug from 'pug'
import nodemailer from 'nodemailer'
import { htmlToText } from 'html-to-text'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

// Constants
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default class Email {
  constructor(user) {
    this.user = user
    this.from = `${process.env.APP_NAME} <${process.env.MAIL_FROM}>`
  }

  /**
   * Create email transport
   */
  createEmailTransport() {
    if (process.env.NODE_ENV === 'PRODUCTION') {
      // sendgrid
      return 1
    }

    // 1) Create a transporter
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    })
  }

  /**
   * Send actual email
   */
  async send(subject, template, templateParameters) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      templateParameters
    )

    // 2) Define email properties
    const mailOptions = {
      from: this.from,
      to: this.user.email,
      subject,
      html,
      text: htmlToText(html),
    }

    // 3) Create transport & send email
    await this.createEmailTransport().sendMail(mailOptions)
  }

  /**
   * Send email on new user registration
   */
  async sendWelcome(token) {
    const url = `${process.env.APP_URL}/api/v1/auth/email/verify/${token}`
    const subject = `Welcome to ${process.env.APP_NAME} family!`
    const templateParameters = {
      url,
      subject,
      firstName: this.user.firstName,
      appName: process.env.APP_NAME,
      fromName: process.env.MAIL_FROM_NAME,
    }

    await this.send(subject, 'welcome', templateParameters)
  }
}
