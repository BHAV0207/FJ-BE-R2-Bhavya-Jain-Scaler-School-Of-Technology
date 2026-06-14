import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  await transporter.sendMail({
    from: env.SMTP_USER,
    to,
    subject,
    html,
  });
}
