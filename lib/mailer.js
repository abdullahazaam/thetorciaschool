import nodemailer from 'nodemailer';

// Nodemailer transporter configured with standard SMTP credentials
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const DEFAULT_FROM = process.env.SMTP_FROM || `"${process.env.SMTP_FROM_NAME || 'The Torcia School'}" <${process.env.SMTP_USER || 'thetorciaschool@gmail.com'}>`;
const ADMIN_EMAIL = 'thetorciaschool@gmail.com';

/**
 * Common HTML email wrapper with branded header and styling
 */
function createEmailTemplate({ title, subtitle, contentHtml }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Branded Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #87131A 0%, #A01A22 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                The Torcia School
              </h1>
              <p style="margin: 6px 0 0 0; color: #fecdd3; font-size: 13px; font-weight: 500; letter-spacing: 0.5px;">
                ${subtitle || 'Growing Future Leaders • Nazimabad, Karachi'}
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 24px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 600; color: #334155;">The Torcia School</p>
              <p style="margin: 0 0 4px 0;">Plot # 20/13 Block 5C, Nazimabad, Karachi</p>
              <p style="margin: 0;">Phone: <a href="tel:03422049976" style="color: #A01A22; text-decoration: none; font-weight: 600;">0342-2049976</a> • Email: <a href="mailto:thetorciaschool@gmail.com" style="color: #A01A22; text-decoration: none; font-weight: 600;">thetorciaschool@gmail.com</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Handle Admissions Form Notifications
 */
export async function sendAdmissionNotifications(admission) {
  const { studentName, parentName, email, phone, grade } = admission;

  // 1. Send confirmation to user (if email is provided)
  if (email && email.trim()) {
    try {
      const userHtml = createEmailTemplate({
        title: 'Admission Inquiry Received - The Torcia School',
        subtitle: 'Admissions Office • Session 2026–2027',
        contentHtml: `
          <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
            Dear ${parentName || 'Parent / Guardian'},
          </h2>
          <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #334155;">
            Thank you for your interest in <strong>The Torcia School</strong>. We have received your preliminary admission inquiry for <strong>${studentName}</strong>. Our admissions counselor will review your submission and contact you shortly to schedule an introductory campus visit and assessment.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; color: #A01A22; font-weight: 700; letter-spacing: 0.5px;">
              Summary of Submitted Details
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 40%; font-weight: 600;">Student Name:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${studentName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Parent / Guardian:</td>
                <td style="padding: 6px 0; color: #0f172a;">${parentName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Grade Applying For:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${grade}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone / WhatsApp:</td>
                <td style="padding: 6px 0; color: #0f172a;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email Address:</td>
                <td style="padding: 6px 0; color: #0f172a;">${email}</td>
              </tr>
            </table>
          </div>

          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">
            If you have any immediate questions, feel free to call our admissions desk at <strong style="color: #A01A22;">0342-2049976</strong> during campus hours (Monday to Saturday, 7:45 am - 2:00 pm).
          </p>
        `,
      });

      await transporter.sendMail({
        from: DEFAULT_FROM,
        to: email,
        subject: `Admission Inquiry Confirmation - ${studentName} | The Torcia School`,
        html: userHtml,
      });
    } catch (err) {
      console.error('[Mailer] Error sending admission confirmation to user:', err.message);
    }
  }

  // 2. Immediately trigger alert email to admin
  try {
    const adminHtml = createEmailTemplate({
      title: 'New Admission Inquiry Alert',
      subtitle: 'Administration Alert Notification',
      contentHtml: `
        <div style="background-color: #fef2f2; border-left: 4px solid #A01A22; padding: 14px 16px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="margin: 0 0 4px 0; color: #991b1b; font-size: 16px; font-weight: 700;">
            🔔 New Admission Inquiry Received
          </h2>
          <p style="margin: 0; font-size: 13px; color: #7f1d1d;">
            A new admission inquiry has been submitted online and recorded in the database.
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; color: #0f172a; font-weight: 700; letter-spacing: 0.5px;">
            Applicant Details
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 40%; font-weight: 600;">Student Name:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${studentName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Grade:</td>
              <td style="padding: 6px 0; color: #A01A22; font-weight: 700;">${grade}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Parent / Guardian:</td>
              <td style="padding: 6px 0; color: #0f172a;">${parentName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone / WhatsApp:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;"><a href="tel:${phone}" style="color: #A01A22;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
              <td style="padding: 6px 0; color: #0f172a;">${email || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Submission Time:</td>
              <td style="padding: 6px 0; color: #0f172a;">${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</td>
            </tr>
          </table>
        </div>

        <p style="margin: 0; font-size: 13px; color: #475569;">
          Log in to the Admin Dashboard to review all inquiries or update admission status.
        </p>
      `,
    });

    await transporter.sendMail({
      from: DEFAULT_FROM,
      to: ADMIN_EMAIL,
      subject: `[New Inquiry] ${studentName} - ${grade} | The Torcia School`,
      html: adminHtml,
    });
  } catch (err) {
    console.error('[Mailer] Error sending admission alert to admin:', err.message);
  }
}

/**
 * Handle Contact Form Notifications
 */
export async function sendContactNotifications(contact) {
  const { name, email, phone, subject, message } = contact;

  // 1. Send confirmation to user (if email is provided)
  if (email && email.trim()) {
    try {
      const userHtml = createEmailTemplate({
        title: 'Message Received - The Torcia School',
        subtitle: 'Campus Administration',
        contentHtml: `
          <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
            Dear ${name || 'Valued Visitor'},
          </h2>
          <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #334155;">
            Thank you for reaching out to <strong>The Torcia School</strong>. We have received your inquiry regarding <strong>"${subject || 'General Inquiry'}"</strong>. Our administration team is reviewing your message and will respond as soon as possible.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; color: #A01A22; font-weight: 700; letter-spacing: 0.5px;">
              Summary of Your Message
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 30%; font-weight: 600;">Name:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Subject:</td>
                <td style="padding: 6px 0; color: #0f172a;">${subject || 'General Inquiry'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
                <td style="padding: 6px 0; color: #0f172a;">${email}</td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone:</td>
                <td style="padding: 6px 0; color: #0f172a;">${phone}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 8px 0 0 0; color: #64748b; font-weight: 600; vertical-align: top;">Message:</td>
                <td style="padding: 8px 0 0 0; color: #334155; line-height: 1.5; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
          </div>

          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">
            For urgent matters, please call our campus reception at <strong style="color: #A01A22;">0342-2049976</strong> during working hours.
          </p>
        `,
      });

      await transporter.sendMail({
        from: DEFAULT_FROM,
        to: email,
        subject: `Message Received: ${subject || 'Inquiry'} | The Torcia School`,
        html: userHtml,
      });
    } catch (err) {
      console.error('[Mailer] Error sending contact confirmation to user:', err.message);
    }
  }

  // 2. Immediately trigger alert email to admin
  try {
    const adminHtml = createEmailTemplate({
      title: 'New Contact Message Alert',
      subtitle: 'Administration Alert Notification',
      contentHtml: `
        <div style="background-color: #fef2f2; border-left: 4px solid #A01A22; padding: 14px 16px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="margin: 0 0 4px 0; color: #991b1b; font-size: 16px; font-weight: 700;">
            ✉️ New Contact Message Received
          </h2>
          <p style="margin: 0; font-size: 13px; color: #7f1d1d;">
            A visitor has submitted a new contact inquiry via the website.
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; color: #0f172a; font-weight: 700; letter-spacing: 0.5px;">
            Inquiry Information
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 30%; font-weight: 600;">Sender:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Subject:</td>
              <td style="padding: 6px 0; color: #A01A22; font-weight: 700;">${subject || 'General Inquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
              <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #A01A22;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone:</td>
              <td style="padding: 6px 0; color: #0f172a;">${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Submitted:</td>
              <td style="padding: 6px 0; color: #0f172a;">${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0 0 0; color: #64748b; font-weight: 600; vertical-align: top;">Message:</td>
              <td style="padding: 10px 0 0 0; color: #1e293b; line-height: 1.5; white-space: pre-wrap; font-family: inherit;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    await transporter.sendMail({
      from: DEFAULT_FROM,
      to: ADMIN_EMAIL,
      subject: `[New Contact] ${subject || 'Inquiry'} from ${name} | The Torcia School`,
      html: adminHtml,
    });
  } catch (err) {
    console.error('[Mailer] Error sending contact alert to admin:', err.message);
  }
}

export default transporter;
