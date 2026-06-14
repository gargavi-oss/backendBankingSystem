require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });
transporter.verify((error) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});
const getHtmlLayout = (heading, contentHtml) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h2 style="color: #1a73e8; margin-top: 0; border-bottom: 1px solid #e0e0e0; padding-bottom: 15px;">${heading}</h2>
        
        <div style="color: #333333; line-height: 1.6; font-size: 15px;">
            ${contentHtml}
        </div>
        
        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #e0e0e0;">
        <div style="font-size: 12px; color: #666666;">
            <p>This is an automated notification from SecureBank. Please do not reply directly to this email.</p>
            <p>If you did not initiate this action, please contact support immediately.</p>
            <p>© ${new Date().getFullYear()} SecureBank. All rights reserved.</p>
        </div>
    </div>
`;

async function sendEmail(to, subject, text, contentHtml, heading = "SecureBank") {
    try {
        const info = await transporter.sendMail({
            from: `"SecureBank" <${process.env.EMAIL_USER}>`,
            to,
            replyTo: process.env.EMAIL_USER,
            subject,
            text,
            html: getHtmlLayout(heading, contentHtml)
        });
        console.log("Email sent successfully. Message ID:", info.messageId);
        return info;
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        throw error;
    }
}

async function sendRegistrationEmail(email, name) {
    const subject = "Welcome to SecureBank";
    const text = `Dear ${name}, your SecureBank account has been successfully created.`;
    const htmlContent = `
        <p>Dear ${name},</p>
        <p>Your SecureBank account has been successfully created.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <strong>Account Information</strong><br>
            Registered Email: ${email}<br>
            Status: <span style="color: #2e7d32; font-weight: bold;">Active</span>
        </div>
        <p>You can now securely access banking services through our platform.</p>
    `;

    return sendEmail(email, subject, text, htmlContent, "Welcome to SecureBank");
}

async function sendLoginEmail(email, name) {
    const timestamp = new Date().toLocaleString();
    const subject = "SecureBank Login Alert";
    const text = `Dear ${name}, a successful login was detected on your SecureBank account at ${timestamp}.`;
    const htmlContent = `
        <p>Dear ${name},</p>
        <p>A new, successful login was detected on your account.</p>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffb74d;">
            <strong>Security Log Details</strong><br>
            <strong>Time:</strong> ${timestamp}<br>
            <strong>Status:</strong> Success
        </div>
        <p>If this was not you, please lock your account or reach out to our emergency helpdesk immediately.</p>
    `;

    return sendEmail(email, subject, text, htmlContent, "Security Notification");
}

async function sendTransactionEmail(email, name, amount, toAccount) {
    const subject = "Transaction Successful";
    const text = `Dear ${name}, ₹${amount} was transferred successfully to account ${toAccount}.`;
    const htmlContent = `
        <p>Dear ${name},</p>
        <p>Your transfer request has been completed successfully.</p>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #81c784;">
            <strong>Receipt Details</strong><br>
            <strong>Amount:</strong> ₹${amount}<br>
            <strong>Beneficiary Account:</strong> ${toAccount}<br>
            <strong>Status:</strong> Completed
        </div>
    `;

    return sendEmail(email, subject, text, htmlContent, "Transaction Receipt");
}

async function sendFailedTransactionEmail(email, name, amount, toAccount, reason) {
    const subject = "Transaction Failed";
    const text = `Dear ${name}, transaction of ₹${amount} to account ${toAccount} failed. Reason: ${reason}`;
    const htmlContent = `
        <p>Dear ${name},</p>
        <p>We were unable to process your recent transfer request.</p>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #e57373;">
            <strong style="color: #c62828;">Declined Details</strong><br>
            <strong>Attempted Amount:</strong> ₹${amount}<br>
            <strong>Target Account:</strong> ${toAccount}<br>
            <strong>Reason for Failure:</strong> ${reason}
        </div>
        <p>Please review your account details or check your balance before trying again.</p>
    `;

    return sendEmail(email, subject, text, htmlContent, "Transaction Declined");
}

module.exports = {
    sendRegistrationEmail, // Fixed typo in function name ("sendRegsistrationEmail" -> "sendRegistrationEmail")
    sendLoginEmail,
    sendTransactionEmail,
    sendFailedTransactionEmail
};