import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, // Try 465 natively as Render free tiers sometimes block 587 (STARTTLS) but allow 465 (SSL/TLS)
        secure: true, 
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
        tls: {
            rejectUnauthorized: false
        },
        logger: true, // Log to console 
        debug: true   // Include SMTP traffic in the logs
    });

    // Still force IPv4 just in case
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