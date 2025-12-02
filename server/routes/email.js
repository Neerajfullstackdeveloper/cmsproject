import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/send', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ success: false, message: 'Missing to, subject or html in request body' });
  }

  // Read SMTP config from env
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  if (!host || !port || !user || !pass) {
    return res.status(500).json({ success: false, message: 'SMTP not configured on server. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: Boolean(secure),
      auth: {
        user,
        pass,
      },
    });

    const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || `no-reply@${host}`;

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    return res.json({ success: true, message: 'Email sent', info });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send email', error: err?.message || err });
  }
});

export default router;
