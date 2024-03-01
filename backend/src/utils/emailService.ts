import * as AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export const sendEmail = async (emailParams: { subject: string; body: string; recipient: string; }) => {
  const params = {
    Source: process.env.EMAIL_SOURCE || '', 
    Destination: {
      ToAddresses: [emailParams.recipient],
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

  try {
    await ses.sendEmail(params).promise();
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email', error);
  }
};