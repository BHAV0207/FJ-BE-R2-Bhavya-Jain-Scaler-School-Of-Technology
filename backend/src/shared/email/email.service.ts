import sgMail from "@sendgrid/mail";
import { env } from "../../config/env.js";

sgMail.setApiKey(env.SENDGRID_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  await sgMail.send({
    to,
    from: env.EMAIL_FROM,
    subject,
    html,
  });
}
