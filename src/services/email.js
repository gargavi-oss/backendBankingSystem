require('dotenv').config();
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});


transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


async function sendEmail(to, subject, text, html) {
    try {
        const info = await transporter.sendMail({
            from: `"SecureBank" <${process.env.EMAIL_USER}>`,
            to,
            replyTo: process.env.EMAIL_USER,
            subject,
            text,
            html
        });

        console.log("Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

function emailFooter() {
    return `
        <hr style="margin-top:20px;">
        <div style="font-size:12px;color:#666;">
            <p>
                This is an automated notification from SecureBank.
                Please do not reply directly to this email.
            </p>

            <p>
                If you did not initiate this action, please contact support immediately.
            </p>

            <p>
                © ${new Date().getFullYear()} SecureBank. All rights reserved.
            </p>
        </div>
    `;
}


  async function sendRegsistrationEmail(email,name){
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a73e8;">Welcome to SecureBank</h2>
    
        <p>Dear ${name},</p>
    
        <p>
            Your SecureBank account has been successfully created.
        </p>
    
        <div style="background:#f5f5f5;padding:15px;border-radius:8px;">
            <b>Account Information</b><br>
            Registered Email: ${email}<br>
            Status: Active
        </div>
    
        <p>
            You can now securely access banking services through our platform.
        </p>
    
        ${emailFooter()}
    </div>
    `;
await sendEmail(
    email,
    "Welcome to SecureBank",
    `Welcome ${name}. Your SecureBank account has been successfully created.`,
    html
);
  }

async function sendLoginEmail(email,name){
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a73e8;">Welcome to SecureBank</h2>
    
        <p>Dear ${name},</p>
    
        <p>
            Your SecureBank account has been successfully created.
        </p>
    
        <div style="background:#f5f5f5;padding:15px;border-radius:8px;">
            <b>Account Information</b><br>
            Registered Email: ${email}<br>
            Status: Active
        </div>
    
        <p>
            You can now securely access banking services through our platform.
        </p>
    
        ${emailFooter()}
    </div>
    `;
    await sendEmail(
        email,
        "SecureBank Login Alert",
        `A successful login was detected on your SecureBank account at ${new Date().toLocaleString()}.`,
        html
    );
}

async function sendTransactionEmail(
    userEmail,
    name,
    amount,
    toAccount
){
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a73e8;">Welcome to SecureBank</h2>
    
        <p>Dear ${name},</p>
    
        <p>
            Your SecureBank account has been successfully created.
        </p>
    
        <div style="background:#f5f5f5;padding:15px;border-radius:8px;">
            <b>Account Information</b><br>
            Registered Email: ${email}<br>
            Status: Active
        </div>
    
        <p>
            You can now securely access banking services through our platform.
        </p>
    
        ${emailFooter()}
    </div>
    `;
    await sendEmail(
        userEmail,
        "Transaction Successful",
        `₹${amount} transferred successfully to account ${toAccount}.`,
        html
    );
}

async function sendFailedTransactionEmail(
    userEmail,
    name,
    amount,
    toAccount,
    reason
){
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a73e8;">Welcome to SecureBank</h2>
    
        <p>Dear ${name},</p>
    
        <p>
            Your SecureBank account has been successfully created.
        </p>
    
        <div style="background:#f5f5f5;padding:15px;border-radius:8px;">
            <b>Account Information</b><br>
            Registered Email: ${email}<br>
            Status: Active
        </div>
    
        <p>
            You can now securely access banking services through our platform.
        </p>
    
        ${emailFooter()}
    </div>
    `;
    await sendEmail(
        userEmail,
        "Transaction Failed",
        `Transaction of ₹${amount} to account ${toAccount} failed. Reason: ${reason}`,
        html
    );
}


module.exports = {sendRegsistrationEmail,sendLoginEmail,sendTransactionEmail,sendFailedTransactionEmail};