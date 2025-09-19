import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

interface EmailParamProps {
  email: string;
  topic: string;
  message: string;
}

export async function POST(request: NextRequest) {
  const emailParams: EmailParamProps = await request.json();

  if (!process.env.EMAIL_SOURCE) {
    throw "Email Source not defined";
  }
  if (!process.env.CONTACT_RECEIVER_EMAIL) {
    throw "Email Receiver not defined";
  }

  const textMessage = `Email: ${emailParams.email}\nTopic: ${emailParams.topic}\nMessage: ${emailParams.message}`;

  const htmlMessage = `<p><strong>Email:</strong> ${emailParams.email}</p><p><strong>Topic:</strong> ${emailParams.topic}</p><p><strong>Message:</strong> ${emailParams.message}</p>`;

  async function main() {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT as string, 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_SOURCE,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: emailParams.topic,
      text: textMessage,
      html: htmlMessage,
    });

    return {
      success: true,
      message: { info },
    };
  }

  const sendMail = await main();
  const { success } = sendMail;

  if (success) {
    return NextResponse.json({
      status: 200,
      body: {
        message: "Email sent successfully",
      },
    });
  } else {
    return NextResponse.json({
      status: 500,
      body: {
        message: "Error sending email",
      },
    });
  }
}
