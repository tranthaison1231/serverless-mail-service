import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const getEmailTemplate = async (key: string, bucket: string) => {
  try {
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
    });
    const response = await s3.send(new GetObjectCommand({ Key: key, Bucket: bucket }));
    const str = await response?.Body?.transformToString?.();
    return str;
  } catch (error) {
    console.error('Error getting file with S3: ', error);
    throw error;
  }
};
