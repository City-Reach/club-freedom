import { S3Client } from "@aws-sdk/client-s3";
import { type Infer, v } from "convex/values";

export const r2ConfigValidator = v.object({
  bucket: v.string(),
  endpoint: v.string(),
  accessKeyId: v.string(),
  secretAccessKey: v.string(),
});

export const createR2Client = (args: Infer<typeof r2ConfigValidator>) => {
  return new S3Client({
    region: "auto",
    endpoint: args.endpoint,
    credentials: {
      accessKeyId: args.accessKeyId,
      secretAccessKey: args.secretAccessKey,
    },
  });
};
