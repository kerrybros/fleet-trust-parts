import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const SENDER_UPN = process.env.CONTACT_SENDER_UPN ?? "info@fleettrustparts.com";
const RECIPIENT = process.env.CONTACT_RECIPIENT ?? "info@fleettrustparts.com";
const SITE_URL = process.env.SITE_URL ?? "https://fleettrustparts.com";
const LOGO_URL = `${SITE_URL}/FTP%20Logo%20Transparent%20Background.png`;

const BRAND_NAVY = "#1e3a5f";
const BRAND_CHARCOAL = "#1a1a1a";
const BRAND_MUTED = "#6b7280";
const BRAND_BG = "#f5f5f7";
const BRAND_BORDER = "#e5e7eb";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(s: string) {
  return escapeHtml(s).replace(/\n/g, "<br>");
}

async function getAccessToken() {
  if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing Azure credentials");
  }
  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token request failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

type Message = {
  subject: string;
  html: string;
  to: string;
  replyTo?: { address: string; name?: string };
};

async function sendMail(token: string, m: Message) {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER_UPN)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: m.subject,
          body: { contentType: "HTML", content: m.html },
          toRecipients: [{ emailAddress: { address: m.to } }],
          ...(m.replyTo && {
            replyTo: [
              {
                emailAddress: {
                  address: m.replyTo.address,
                  ...(m.replyTo.name && { name: m.replyTo.name }),
                },
              },
            ],
          }),
        },
        saveToSentItems: true,
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Graph sendMail failed: ${res.status} ${text}`);
  }
}

function emailShell(innerHtml: string, preheader: string, showFooter: boolean) {
  const footerRow = showFooter
    ? `<tr>
          <td style="padding:16px 32px 32px 32px;border-top:1px solid ${BRAND_BORDER};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-size:12px;color:${BRAND_MUTED};line-height:1.6;">
                  <strong style="color:${BRAND_CHARCOAL};">Fleet Trust Parts</strong><br>
                  <a href="mailto:info@fleettrustparts.com" style="color:${BRAND_NAVY};text-decoration:none;">info@fleettrustparts.com</a><br>
                  Office: <a href="tel:+13138956600" style="color:${BRAND_NAVY};text-decoration:none;">313-895-6600</a> &nbsp;&middot;&nbsp; Cell: <a href="tel:+13139008059" style="color:${BRAND_NAVY};text-decoration:none;">313-900-8059</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    : "";
  const bodyPadding = showFooter ? "32px 32px 16px 32px" : "32px";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fleet Trust Parts</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND_CHARCOAL};">
<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND_BG};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr>
          <td align="center" style="background-color:${BRAND_NAVY};padding:28px 24px;">
            <img src="${LOGO_URL}" alt="Fleet Trust Parts" width="120" height="120" style="display:block;border:0;outline:none;text-decoration:none;width:120px;height:auto;max-width:120px;background-color:#ffffff;border-radius:8px;padding:8px;">
          </td>
        </tr>
        <tr>
          <td style="padding:${bodyPadding};">
            ${innerHtml}
          </td>
        </tr>
        ${footerRow}
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function teamEmail(name: string, email: string, phone: string, message: string) {
  const inner = `
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:${BRAND_CHARCOAL};">New contact form submission</h1>
    <p style="margin:0 0 24px 0;font-size:14px;color:${BRAND_MUTED};">Someone just sent a message through fleettrustparts.com.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND_BG};border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:4px 0;font-size:13px;color:${BRAND_MUTED};width:70px;">Name</td>
              <td style="padding:4px 0;font-size:14px;color:${BRAND_CHARCOAL};font-weight:600;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:${BRAND_MUTED};">Email</td>
              <td style="padding:4px 0;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:${BRAND_NAVY};text-decoration:none;font-weight:600;">${escapeHtml(email)}</a></td>
            </tr>
            ${phone ? `<tr>
              <td style="padding:4px 0;font-size:13px;color:${BRAND_MUTED};">Phone</td>
              <td style="padding:4px 0;font-size:14px;"><a href="tel:${escapeHtml(phone)}" style="color:${BRAND_NAVY};text-decoration:none;font-weight:600;">${escapeHtml(phone)}</a></td>
            </tr>` : ""}
          </table>
        </td>
      </tr>
    </table>

    <div style="font-size:13px;color:${BRAND_MUTED};text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:8px;">Message</div>
    <div style="font-size:15px;line-height:1.6;color:${BRAND_CHARCOAL};background-color:#ffffff;border-left:3px solid ${BRAND_NAVY};padding:4px 0 4px 16px;">${nl2br(message)}</div>
  `;
  return emailShell(inner, `New message from ${name}`, false);
}

function confirmationEmail(name: string, message: string) {
  const firstName = name.split(/\s+/)[0] || name;
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:24px;font-weight:700;color:${BRAND_CHARCOAL};">Thanks, ${escapeHtml(firstName)} — we got it.</h1>
    <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:${BRAND_CHARCOAL};">Thanks for reaching out to Fleet Trust Parts. We&rsquo;ve received your message and someone from our team will get back to you shortly.</p>

    <div style="font-size:13px;color:${BRAND_MUTED};text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:8px;">Your message</div>
    <div style="font-size:15px;line-height:1.6;color:${BRAND_CHARCOAL};background-color:${BRAND_BG};border-left:3px solid ${BRAND_NAVY};padding:16px 20px;border-radius:0 6px 6px 0;margin-bottom:24px;">${nl2br(message)}</div>
  `;
  return emailShell(inner, `We received your message — Fleet Trust Parts`, true);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!name || name.length > 200) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (
    !email ||
    email.length > 320 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (phone.length > 50) {
    return NextResponse.json({ error: "Phone is too long" }, { status: 400 });
  }

  try {
    const token = await getAccessToken();

    await sendMail(token, {
      subject: `New contact from ${name}`,
      html: teamEmail(name, email, phone, message),
      to: RECIPIENT,
      replyTo: { address: email, name },
    });

    try {
      await sendMail(token, {
        subject: "We received your message — Fleet Trust Parts",
        html: confirmationEmail(name, message),
        to: email,
      });
    } catch (err) {
      console.error("Confirmation email failed (non-fatal):", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }
}
