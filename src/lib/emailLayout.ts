/**
 * Branded HTML email layout for QCS ABROAD transactional emails.
 *
 * Email clients are picky: this uses table-based structure, inline styles, and
 * absolute URLs (logo, links) so it renders consistently in Gmail/Outlook/etc.
 * Wrap any email body with `emailLayout(bodyHtml, { preheader })`.
 */

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://www.theqcs.ca"
).replace(/\/$/, "");

const LOGO_URL = `${APP_URL}/QCSLOGO.png`;

const NAVY = "#1e3a5f";
const GOLD = "#d4a853";

const SOCIALS: { label: string; href: string; icon: string }[] = [
  { label: "Instagram", href: "https://www.instagram.com/qcsabroad", icon: "📷" },
  { label: "Facebook", href: "https://www.facebook.com/qcsabroad", icon: "📘" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/qcsabroad", icon: "💼" },
  { label: "X", href: "https://x.com/qcsabroad", icon: "✖️" },
];

export function emailLayout(
  body: string,
  opts: { preheader?: string } = {},
): string {
  const year = new Date().getFullYear();
  const preheader = opts.preheader ?? "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <title>QCS ABROAD</title>
</head>
<body style="margin:0;padding:0;background:#f1f3f5;font-family:Inter,Arial,Helvetica,sans-serif;color:#1a1a2e;">
  ${
    preheader
      ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>`
      : ""
  }
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f3f5;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:92%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(30,58,95,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:${NAVY};padding:20px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <img src="${LOGO_URL}" width="40" height="40" alt="QCS ABROAD"
                      style="display:inline-block;vertical-align:middle;border-radius:8px;background:#ffffff;" />
                    <span style="display:inline-block;vertical-align:middle;margin-left:10px;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
                      QCS <span style="color:${GOLD};font-weight:400;">ABROAD</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Gold accent rule -->
          <tr><td style="height:3px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f9fa;border-top:1px solid #edf2f7;padding:22px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    ${SOCIALS.map(
                      (s) =>
                        `<a href="${s.href}" style="text-decoration:none;font-size:18px;margin:0 6px;" title="${s.label}">${s.icon}</a>`,
                    ).join("")}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <a href="${APP_URL}" style="color:${NAVY};font-size:12px;text-decoration:none;margin:0 8px;">Home</a>
                    <a href="${APP_URL}/services" style="color:${NAVY};font-size:12px;text-decoration:none;margin:0 8px;">Services</a>
                    <a href="${APP_URL}/privacy" style="color:${NAVY};font-size:12px;text-decoration:none;margin:0 8px;">Privacy</a>
                    <a href="${APP_URL}/terms" style="color:${NAVY};font-size:12px;text-decoration:none;margin:0 8px;">Terms</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color:#718096;font-size:11px;line-height:1.6;">
                    QCS ABROAD — Your Gateway to Global Education<br/>
                    Toronto, ON, Canada &middot; Hyderabad, India<br/>
                    &copy; ${year} QCS ABROAD. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
