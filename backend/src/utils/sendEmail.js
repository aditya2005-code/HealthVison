import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
        tls: {
            rejectUnauthorized: false
        }
    });

    // Force IPv4
    transporter.set('socket', {
        family: 4
    });

    await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
            if (error) {
                console.log("Nodemailer verify error:", error);
                reject(error);
            } else {
                resolve(success);
            }
        });
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    const info = await new Promise((resolve, reject) => {
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.error("Nodemailer sendMail error:", err);
                reject(err);
            } else {
                resolve(info);
            }
        });
    });

    console.log('\n================ EMAIL SENT ================');
    console.log(`To:      ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`ID:      ${info.messageId}`);
    console.log('============================================\n');
};