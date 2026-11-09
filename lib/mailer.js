import nodemailer from 'nodemailer';

/**
 * Nodemailer transporter configured with environment credentials:
 * - host: smtp.gmail.com
 * - port: 587
 * - process.env.SMTP_USER
 * - process.env.SMTP_PASS
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const SCHOOL_EMAIL =
  process.env.SCHOOL_EMAIL ||
  process.env.ADMIN_EMAIL ||
  process.env.SMTP_USER ||
  'thetorciaschool@gmail.com';

/**
 * Branded HTML email template wrapper
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
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Branded School Header -->
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

          <!-- Main Email Content -->
          <tr>
            <td style="padding: 32px 24px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Professional Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155;">The Torcia School</p>
              <p style="margin: 0 0 4px 0;">Plot # 20/13 Block 5C, near Abbasi Shaheed Hospital, Nazimabad, Karachi</p>
              <p style="margin: 0;">Phone: <a href="tel:03422049976" style="color: #A01A22; text-decoration: none; font-weight: 600;">0342-2049976</a> • Email: <a href="mailto:${SCHOOL_EMAIL}" style="color: #A01A22; text-decoration: none; font-weight: 600;">${SCHOOL_EMAIL}</a></p>
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
 * - from: '"The Torcia(Admission)" <' + process.env.SMTP_USER + '>'
 * - replyTo: dynamically to the parent's email address
 * - subject: 'New Admission Form - ' + [Student Name]
 */
export async function sendAdmissionNotifications(admission) {
  const { studentName, parentName, email, phone, grade } = admission;
  const timestamp = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });

  const admissionFrom = `"The Torcia(Admission)" <${process.env.SMTP_USER || 'thetorciaschool@gmail.com'}>`;
  const admissionReplyTo = email && email.trim() ? email.trim() : process.env.SMTP_USER || 'thetorciaschool@gmail.com';
  const admissionSubject = 'New Admission Form - ' + (studentName || 'New Applicant');

  // 1. Send Admin Alert Email with Professional Alias & Dynamic Reply-To
  try {
    const adminHtml = createEmailTemplate({
      title: 'New Admission Form',
      subtitle: 'Official Admissions Office Alert',
      contentHtml: `
        <div style="background-color: #fef2f2; border-left: 4px solid #A01A22; padding: 14px 18px; margin-bottom: 22px; border-radius: 6px;">
          <h2 style="margin: 0 0 4px 0; color: #991b1b; font-size: 17px; font-weight: 700;">
            🎓 New Admission Form Received
          </h2>
          <p style="margin: 0; font-size: 13px; color: #7f1d1d;">
            A new admission application has been submitted and recorded in the database.
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; margin-bottom: 22px;">
          <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; color: #0f172a; font-weight: 700; letter-spacing: 0.5px;">
            Applicant &amp; Guardian Information
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 38%; font-weight: 600; border-bottom: 1px solid #edf2f7;">Student Name:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700; border-bottom: 1px solid #edf2f7;">${studentName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; border-bottom: 1px solid #edf2f7;">Grade Applying For:</td>
              <td style="padding: 8px 0; color: #A01A22; font-weight: 700; border-bottom: 1px solid #edf2f7;">${grade}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; border-bottom: 1px solid #edf2f7;">Parent / Guardian:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; border-bottom: 1px solid #edf2f7;">${parentName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; border-bottom: 1px solid #edf2f7;">Phone / WhatsApp:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; border-bottom: 1px solid #edf2f7;">
                <a href="tel:${phone}" style="color: #A01A22; text-decoration: none; font-weight: 700;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; border-bottom: 1px solid #edf2f7;">Email Address:</td>
              <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #edf2f7;">
                ${email ? `<a href="mailto:${email}" style="color: #A01A22; text-decoration: none; font-weight: 600;">${email}</a>` : 'Not Provided'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Submission Timestamp:</td>
              <td style="padding: 8px 0; color: #0f172a;">${timestamp}</td>
            </tr>
          </table>
        </div>

        <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
          You can reply directly to this email to contact the parent (${email || phone}). You can also manage applicants via the <strong>Admin Admissions Desk</strong> (/admin/admissions).
        </p>
      `,
    });

    await transporter.sendMail({
      from: admissionFrom,
      replyTo: admissionReplyTo,
      to: SCHOOL_EMAIL,
      subject: admissionSubject,
      html: adminHtml,
    });
    console.log(`[Mailer] Admin notification sent: "${admissionSubject}" from ${admissionFrom} (replyTo: ${admissionReplyTo})`);
  } catch (err) {
    console.error('[Mailer] Error sending admission alert to admin:', err.message);
  }

  // 2. Send Applicant Confirmation Email (if parent provided an email)
  if (email && email.trim()) {
    try {
      const userHtml = createEmailTemplate({
        title: 'Admission Application Received - The Torcia School',
        subtitle: 'Admissions Office • Session 2026–2027',
        contentHtml: `
          <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
            Dear ${parentName || 'Parent / Guardian'},
          </h2>
          <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #334155;">
            Thank you for applying to <strong>The Torcia School</strong> (<em>"Growing Future Leaders"</em>). We have successfully received your admission application for <strong>${studentName}</strong>.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; color: #A01A22; font-weight: 700; letter-spacing: 0.5px;">
              Summary of Application
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 40%; font-weight: 600;">Student Name:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${studentName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Grade Applying For:</td>
                <td style="padding: 6px 0; color: #A01A22; font-weight: 700;">${grade}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone / WhatsApp:</td>
                <td style="padding: 6px 0; color: #0f172a;">${phone}</td>
              </tr>
            </table>
          </div>

          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">
            Our admissions desk will contact you shortly to schedule an introductory campus visit and assessment. For urgent inquiries, call us at <strong style="color: #A01A22;">0342-2049976</strong>.
          </p>
        `,
      });

      await transporter.sendMail({
        from: admissionFrom,
        replyTo: SCHOOL_EMAIL,
        to: email,
        subject: `Admission Application Received - ${studentName} | The Torcia School`,
        html: userHtml,
      });
    } catch (err) {
      console.error('[Mailer] Error sending admission confirmation to user:', err.message);
    }
  }
}

/**
 * Handle Contact Form Notifications
 * - from: '"The Torcia(Contact)" <' + process.env.SMTP_USER + '>'
 * - replyTo: dynamically to the user's email address
 * - subject: 'New Contact Inquiry - ' + [User Name]
 */
export async function sendContactNotifications(contact) {
  const { name, email, phone, subject, message } = contact;
  const timestamp = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });

  const contactFrom = `"The Torcia(Contact)" <${process.env.SMTP_USER || 'thetorciaschool@gmail.com'}>`;
  const contactReplyTo = email && email.trim() ? email.trim() : process.env.SMTP_USER || 'thetorciaschool@gmail.com';
  const contactSubject = 'New Contact Inquiry - ' + (name || 'Website Visitor');

  // 1. Send Admin Alert Email with Professional Alias & Dynamic Reply-To
  try {
    const adminHtml = createEmailTemplate({
      title: 'New Contact Inquiry',
      subtitle: 'Official Contact Desk Alert',
      contentHtml: `
        <div style="background-color: #fef2f2; border-left: 4px solid #A01A22; padding: 14px 18px; margin-bottom: 22px; border-radius: 6px;">
          <h2 style="margin: 0 0 4px 0; color: #991b1b; font-size: 17px; font-weight: 700;">
            ✉️ New Contact Message Received
          </h2>
          <p style="margin: 0; font-size: 13px; color: #7f1d1d;">
            A visitor has submitted a new inquiry via the website contact form and saved to the database.
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; margin-bottom: 22px;">
          <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; color: #0f172a; font-weight: 700; letter-spacing: 0.5px;">
            Inquiry Information
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 30%; font-weight: 600; border-bottom: 1px solid #edf2f7;">Sender Name:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700; border-bottom: 1px solid #edf2f7;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; border-bottom: 1px solid #edf2f7;">Subject:</td>
              <td style="padding: 8px 0; color: #A01A22; font-weight: 700; border-bottom: 1px solid #edf2f7;">${subject || 'General Inquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; border-bottom: 1px solid #edf2f7;">Email Address:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; border-bottom: 1px solid #edf2f7;">
                <a href="mailto:${email}" style="color: #A01A22; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; border-bottom: 1px solid #edf2f7;">Phone Number:</td>
              <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #edf2f7;">${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; border-bottom: 1px solid #edf2f7;">Submission Time:</td>
              <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #edf2f7;">${timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0 0 0; color: #64748b; font-weight: 600; vertical-align: top;">Message:</td>
              <td style="padding: 12px 0 0 0; color: #1e293b; line-height: 1.6; white-space: pre-wrap; font-family: inherit;">${message}</td>
            </tr>
          </table>
        </div>

        <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
          You can reply directly to this email to respond to <strong style="color: #0f172a;">${name}</strong> at &lt;${email}&gt;.
        </p>
      `,
    });

    await transporter.sendMail({
      from: contactFrom,
      replyTo: contactReplyTo,
      to: SCHOOL_EMAIL,
      subject: contactSubject,
      html: adminHtml,
    });
    console.log(`[Mailer] Admin notification sent: "${contactSubject}" from ${contactFrom} (replyTo: ${contactReplyTo})`);
  } catch (err) {
    console.error('[Mailer] Error sending contact alert to admin:', err.message);
  }

  // 2. Send Visitor Confirmation Email
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
                <td style="padding: 6px 0; color: #64748b; width: 30%; font-weight: 600;">Subject:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${subject || 'General Inquiry'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; vertical-align: top;">Message:</td>
                <td style="padding: 6px 0; color: #334155; line-height: 1.5; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
          </div>

          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">
            For urgent matters, please call our campus reception at <strong style="color: #A01A22;">0342-2049976</strong> during working hours.
          </p>
        `,
      });

      await transporter.sendMail({
        from: contactFrom,
        replyTo: SCHOOL_EMAIL,
        to: email,
        subject: `Message Received: ${subject || 'Inquiry'} | The Torcia School`,
        html: userHtml,
      });
    } catch (err) {
      console.error('[Mailer] Error sending contact confirmation to user:', err.message);
    }
  }
}

export default transporter;
