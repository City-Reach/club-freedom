import { v4 as uuidv4 } from "uuid";
import { mutation } from "./_generated/server";
import { r2 } from "./r2";

export const generateTempUploadUrl = mutation({
  handler: async (ctx) => {
    const myUuid = uuidv4();
    const key = `temp/testimonial-${myUuid}`;
    const { url } = await r2.generateUploadUrl(key);
    const storageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return {
      url,
      key,
      storageUrl,
    };
  },
});
