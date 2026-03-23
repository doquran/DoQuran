import { Resend } from "resend";

const FROM = process.env.MAIL_FROM || "DoQuran <onboarding@resend.dev>";

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendMail(to: string, subject: string, html: string) {
  const client = getClient();

  if (!client) {
    console.log(
      `\n📧 [DEV MAIL] To: ${to}\n   Subject: ${subject}\n   Body:\n${html}\n`,
    );
    return;
  }

  await client.emails.send({ from: FROM, to, subject, html });
}
