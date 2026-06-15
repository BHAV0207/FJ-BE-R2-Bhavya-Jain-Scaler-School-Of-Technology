import sgMail from "@sendgrid/mail";
import { env } from "../../config/env.js";

sgMail.setApiKey(env.SENDGRID_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  try {
    await sgMail.send({
      to,
      from: env.EMAIL_FROM,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error: any) {
    if (error.response) {
      console.error("❌ SendGrid Error Body:", JSON.stringify(error.response.body, null, 2));
    }
    console.error("❌ SendGrid Error:", error.message);
    throw error;
  }
}
