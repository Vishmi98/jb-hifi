import nodemailer from "nodemailer";
import { render } from "@react-email/components";

import JbPromotionEmail from "@/components/JbPromotionEmail";

const emailConfig = {
  user: process.env.E_USER,
  pass: process.env.E_PW,
};

export class EmailService {
  static async sendPromotionEmail(toEmail: string): Promise<boolean> {
    try {
      if (!emailConfig.user || !emailConfig.pass) {
        throw new Error("SMTP_USER and SMTP_PASSWORD must be configured");
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass,
        },
      });

      // Render the React/Tailwind component to HTML string
      const emailHtml = await render(
        JbPromotionEmail({ siteUrl: "https://jb-hifi.vercel.app" })
      );

      const mailOptions = {
        from: `"JB Hi-Fi Deals" <${emailConfig.user}>`,
        to: toEmail,
        subject: "DEALS FOR DAD! 🎁 Huge Savings on Tech, TVs & More",
        html: emailHtml,
      };

      const response = await transporter.sendMail(mailOptions);
      return response?.accepted?.length > 0;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }
}