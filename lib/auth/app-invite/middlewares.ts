import { getSessionFromCtx } from "better-auth/api";
import { createAuthMiddleware } from "better-auth/plugins";

export const adminMiddleware = createAuthMiddleware(async (ctx) => {
  const session = await getSessionFromCtx(ctx);
  const user = session?.user;

  if (!user) {
    throw ctx.error("UNAUTHORIZED", { message: "Unauthorized" });
  }

  if (user?.role !== "admin") {
    throw ctx.error("FORBIDDEN", { message: "Forbidden" });
  }

  return {
    user,
  };
});
