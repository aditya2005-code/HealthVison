import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    const emailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        requireTLS: true, // Force TLS for port 587
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false // Helps avoid some certificate issues in deployed environments
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    };

    const transporter = nodemailer.createTransport(emailConfig);

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('\n================ EMAIL SENT ================');
    console.log(`To:      ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Content: ${options.message}`);
    console.log(`ID:      ${info.messageId}`);
    console.log('============================================\n');
};
