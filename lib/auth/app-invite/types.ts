import { User } from "better-auth";
import { AppInvitation } from "./schema";

export type AppInviteOption = {
  sendInvitationEmail?: (args: {
    invitation: AppInvitation;
    issuer: User;
  }) => Promise<void>;
};
