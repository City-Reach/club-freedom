import { v } from "convex/values";
import { api } from "./_generated/api";
import { type QueryCtx, query } from "./_generated/server";
import { mutation } from "./functions";

export async function getFormPreferenceByOrgIdAndName(
  ctx: QueryCtx,
  name: string,
  orgId: string,
) {
  const formPreference = await ctx.db
    .query("formPreferences")
    .withIndex("byOrganizationId", (q) => q.eq("organizationId", orgId))
    .filter((q) => q.eq(q.field("name"), name))
    .first();
  return formPreference;
}

export const getFormPreferenceByOrgId = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, { organizationId }) => {
    const canUpdateOrg = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: {
        organization: ["update"],
      },
    });
    if (!canUpdateOrg) {
      throw new Error("Forbidden");
    }
    const formPreference = await ctx.db
      .query("formPreferences")
      .withIndex("byOrganizationId", (q) =>
        q.eq("organizationId", organizationId),
      )
      .order("desc")
      .collect();
    return formPreference;
  },
});

export const postFormPreference = mutation({
  args: {
    organizationId: v.string(),
    name: v.string(),
    branding: v.optional(v.string()),
    textInstructions: v.optional(v.string()),
    textEnabled: v.boolean(),
    audioInstructions: v.optional(v.string()),
    audioEnabled: v.boolean(),
    videoInstructions: v.optional(v.string()),
    videoEnabled: v.boolean(),
    agreements: v.optional(v.array(v.string())),
  },
  handler: async (
    ctx,
    {
      organizationId,
      name,
      branding,
      textInstructions,
      textEnabled,
      audioInstructions,
      audioEnabled,
      videoInstructions,
      videoEnabled,
      agreements,
    },
  ) => {
    const canUpdateOrg = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: {
        organization: ["update"],
      },
    });
    if (!canUpdateOrg) {
      throw new Error("Forbidden");
    }
    const existingPreference = await getFormPreferenceByOrgIdAndName(
      ctx,
      name,
      organizationId,
    );
    if (existingPreference) {
      throw new Error(
        "Another form preference with the same name already exists for this organization. Please choose a different name.",
      );
    }
    const id = await ctx.db.insert("formPreferences", {
      organizationId,
      name,
      branding,
      textInstructions,
      textEnabled,
      audioInstructions,
      audioEnabled,
      videoInstructions,
      videoEnabled,
      agreements,
      activated: true,
    });
    return id;
  },
});
