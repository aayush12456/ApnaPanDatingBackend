const nodemailer = require('nodemailer');

// Reusable email sending function
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                // user: 'apnapan96@gmail.com',
                // pass: 'jqcz pymc zffw tmni'
                user: 'apnapan232@gmail.com',
                pass: 'iaww nvwa zcnv omae'
            }
        });

        const mailOptions = {
            // from: 'apnapan96@gmail.com',
            from: 'apnapan232@gmail.com',
            to,
            subject,
            html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', result);
        return result;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
};

module.exports = { sendEmail };
