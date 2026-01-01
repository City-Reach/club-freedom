import { mutation } from "./_generated/server";
import { r2 } from "./r2";

export const generateTempUploadUrl = mutation({
  handler: async (ctx) => {
    const key = `temp/testimonial-${Date.now()}`;
    const { url } = await r2.generateUploadUrl(key);
    const storageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return {
      url,
      key,
      storageUrl,
    };
  },
});
