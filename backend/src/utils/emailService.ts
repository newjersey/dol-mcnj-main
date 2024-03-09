import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' });
const ses = new AWS.SES();

interface EmailParams {
  subject: string;
  body: string;
}

export async function sendEmail(emailParams: EmailParams): Promise<void>{
  if(!process.env.EMAIL_SOURCE) {
     throw 'Email Source not defined'
  }
  if(!process.env.CONTACT_RECEIVER_EMAIL) {
    throw 'Email Receiver not defined'
 }
  const params: AWS.SES.SendEmailRequest = {
    Source: process.env.EMAIL_SOURCE, 
    Destination: {
      ToAddresses: [process.env.CONTACT_RECEIVER_EMAIL],
    },
    Message: {
      Subject: {
        Data: emailParams.subject,
      },
      Body: {
        Text: {
          Data: emailParams.body,
        },
      },
    },
  };

  await ses.sendEmail(params).promise();
  console.log('Email sent successfully');
}