const { S3_ALBUM_NAME, AWS_BUCKET_NAME, AWS_REGION } = require( '../templates');

export const HREF = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`;

export const IMAGE_PREFIX = HREF + S3_ALBUM_NAME + "/";

export const ALBUM_PHOTO_KEY = encodeURIComponent(S3_ALBUM_NAME) + "/";
