import { Resend } from "@convex-dev/resend";
import type { ActionCtx } from "./_generated/server";
import { components } from "./_generated/api";
import { render } from "@react-email/components";
import ResetPasswordEmail from "../components/emails/reset-password";

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
  }
) => {
  await resend.sendEmail(ctx, {
    from: `Club Freedom <${process.env.AUTH_EMAIL}>`,
    to,
    subject: "Reset your password",
    html: await render(<ResetPasswordEmail url={url} />),
  });
};
