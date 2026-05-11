import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, code: string) {
  try {
    const mailOptions = {
      from: `"Método Sintotérmico" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Código de recuperación de contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <h2 style="color: #333;">Recuperación de Contraseña</h2>
          <p style="color: #666; font-size: 16px;">Has solicitado restablecer tu contraseña. Utiliza el siguiente código para continuar:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h1 style="margin: 0; color: #FF5A5F; letter-spacing: 5px;">${code}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">Este código expirará en 15 minutos.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">Si no has solicitado esto, puedes ignorar este correo.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
