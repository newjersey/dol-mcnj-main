import Nodemailer from "nodemailer"

interface EmailParams {
  subject: string,
  body: string
}

const transporter = Nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT as string, 10) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(emailParams: EmailParams): Promise<void> {
  if (!process.env.EMAIL_SOURCE) {
    throw 'Email Source not defined'
  }
  if (!process.env.CONTACT_RECEIVER_EMAIL) {
    throw 'Email Receiver not defined'
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_SOURCE,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: emailParams.subject,
      text: emailParams.body,
    })
  } catch (error) {
    console.log("Error Sending Email Via SES", error)
  }
}
