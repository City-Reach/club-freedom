import { query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

export const listMembers = query({
  handler: async (ctx) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    return await auth.api.listUsers({
      headers,
      query: {
        sortBy: "name",
      },
    });
  },
});

export const listInvitations = query({
  handler: async (ctx) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    return await auth.api.listAppInvitations({
      headers,
    });
  },
});
