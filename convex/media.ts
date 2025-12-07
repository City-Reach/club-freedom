"use node";

import { extension as getExtension } from "mime-types";
import { createR2Client } from "@/lib/r2";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { r2 } from "./r2";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { postHogClient } from "@/utils/posthog-convex";

export const generateMediaDownloadUrl = action({
  args: { id: v.id("testimonials") },
  handler: async (ctx, { id }) => {
    try {
      const testimonial = await ctx.runQuery(
        api.testimonials.getTestimonialById,
        { id }
      );

      if (!testimonial || !testimonial.storageId) {
        return undefined;
      }

      const r2Client = createR2Client(r2.config);

      const fileName = `${Math.floor(testimonial._creationTime)}-${testimonial.name}-${testimonial.storageId}`;
      const metadata = await r2.getMetadata(ctx, testimonial.storageId);
      const extension = getExtension(metadata?.contentType || "") ?? "webm";
      const file = `${fileName}.${extension}`;

      const url: string = await getSignedUrl(
        r2Client,
        new GetObjectCommand({
          Bucket: r2.config.bucket,
          Key: testimonial.storageId,
          ResponseContentDisposition: `attachment; filename="${file}"`,
          ResponseContentType: metadata?.contentType,
        }),
        { expiresIn: 900 } // URL valid for 15 minutes
      );

      return url;
    } catch (e) {
      postHogClient.captureException(e, `generateMediaDownloadUrl-${id}`, { id: id });
      return undefined
    }
  },
});
