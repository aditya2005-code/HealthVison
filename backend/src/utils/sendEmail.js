import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    const emailConfig = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    };

    // Use built-in service for Gmail to avoid Render/Node connection timeouts
    if (process.env.SMTP_HOST === 'smtp.gmail.com') {
        emailConfig.service = 'gmail';
    }

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
