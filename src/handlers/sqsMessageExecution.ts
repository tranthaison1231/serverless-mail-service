require('dotenv').config();
import { getEmailTemplate } from '@/utils/getEmailTemplate';
import { SQSEvent } from 'aws-lambda';
import { createTransport } from 'nodemailer';
import template from 'lodash.template';
import middy from '@middy/core';
import sqsPartialBatchFailureMiddleware from '@middy/sqs-partial-batch-failure';

interface MessageInterface {
  data: MailData;
}
interface MailData {
  name: string;
  link: string;
  to: string;
}

const sendMailForgotPassword = async ({ data }: { data: MailData }) => {
  const mailTransport = process.env.MAIL_TRANSPORT;
  if (!mailTransport) throw new Error('MAIL_TRANSPORT is not defined');
  const transporter = createTransport(mailTransport);
  const content = await getEmailTemplate('emails/forgot-password.html', 'nest-basic');
  await transporter.sendMail({
    from: `"No Reply" <${process.env.MAIL_FROM}>`,
    to: data.to,
    subject: 'Welcome to my website',
    html: template(content)({
      name: data.link,
      link: data.link,
    }),
  });
  console.log('Send mail successfully!');
};

export const handleQueue = async (event: SQSEvent) => {
  const messagePromises = event.Records.map((record) => {
    const { body } = record;
    const data: MessageInterface = JSON.parse(body);
    return sendMailForgotPassword(data);
  });
  return Promise.allSettled(messagePromises);
};

export const handler = middy(handleQueue).use(sqsPartialBatchFailureMiddleware());
