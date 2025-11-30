import { BetterAuthClientPlugin } from "better-auth";
import type { appInvite } from "./plugin";

export const appInviteClient = () => {
  return {
    id: "app-invite",
    $InferServerPlugin: {} as ReturnType<typeof appInvite>,
  } satisfies BetterAuthClientPlugin;
};
