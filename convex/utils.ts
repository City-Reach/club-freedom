import { MutationCtx } from "./_generated/server";

export default function removeUndefinedFromRecord(ctx: MutationCtx, args: Record<string, any>): Record<string, any> {
    let cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(args)) {
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned
}