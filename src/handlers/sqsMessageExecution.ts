require('dotenv').config();
import { getEmailTemplate } from '@/utils/getEmailTemplate';
import { SQSHandler } from 'aws-lambda';
import { createTransport } from 'nodemailer';
import template from 'lodash.template';

export const handler: SQSHandler = async (event) => {
  try {
    console.log(event);
    const mailTransport = process.env.MAIL_TRANSPORT;
    if (!mailTransport) throw new Error('MAIL_TRANSPORT is not defined');
    const transporter = createTransport(mailTransport);
    const content = await getEmailTemplate('emails/forgot-password.html', 'nest-basic');
    await transporter.sendMail({
      from: `"No Reply" <${process.env.MAIL_FROM}>`,
      to: 'thanhhuyenpoo13@gmail.com',
      subject: 'Welcome to my website',
      html: template(content)({
        name: 'Thanh Huyen',
        link: 'https://www.google.com',
      }),
    });
    console.log('Send mail successfully!');
  } catch (error) {
    console.error(error);
    throw error;
  }
};
