import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/components";
import ResetPasswordEmail from "../emails/reset-password";
import { components } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";

export const resend = new Resend(components.resend, {
  testMode: false,
});

export const sendResetPassword = async (
  ctx: ActionCtx,
  {
    to,
    url,
  }: {
    to: string;
    url: string;
  },
) => {
  await resend.sendEmail(ctx, {
    from: `Club Freedom <${process.env.AUTH_EMAIL}>`,
    to,
    subject: "Reset your password",
    html: await render(<ResetPasswordEmail url={url} />),
  });
};
