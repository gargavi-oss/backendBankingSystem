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


const sendEmail = async (to, subject, text, html) => {
    try {
      const info = await transporter.sendMail({
        from: `"SecureBank" <${process.env.EMAIL_USER}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
      });
  
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  async function sendRegsistrationEmail(email,name){
    await sendEmail(
        email,
        "Welcome to SecureBank",
        "",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2 style="color:#1a73e8;">Welcome to SecureBank</h2>
    
            <p>Dear ${name},</p>
    
            <p>
                Thank you for registering with <b>SecureBank</b>. Your account has been
                successfully created and is now ready for use.
            </p>
    
            <p>
                With SecureBank, you can securely manage your accounts, monitor
                transactions, and access banking services through our platform.
            </p>
    
            <p>
                For security reasons, please do not share your login credentials
                or verification codes with anyone.
            </p>
    
            <div style="background:#f5f5f5; padding:15px; border-radius:8px;">
                <b>Account Information</b><br>
                Registered Email: ${email}<br>
                Registration Status: Successfully Completed
            </div>
    
            <p style="margin-top:20px;">
                If you did not create this account, please contact our support team immediately.
            </p>
    
            <p>
                Regards,<br>
                <b>SecureBank Team</b>
            </p>
        </div>
        `
    );
  }

async function sendLoginEmail(email,name){
   
    await sendEmail(
        email,
        "SecureBank Login Alert",
        "",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2 style="color:#1a73e8;">Login Notification</h2>
    
            <p>Dear ${name},</p>
    
            <p>
                We detected a successful login to your <b>SecureBank</b> account.
            </p>
    
            <div style="background:#f5f5f5; padding:15px; border-radius:8px;">
                <b>Login Details</b><br>
                Email: ${email}<br>
                Time: ${new Date().toLocaleString()}<br>
                Status: Successful Login
            </div>
    
            <p style="margin-top:20px;">
                If this login was performed by you, no further action is required.
            </p>
    
            <p>
                If you do not recognize this activity, please reset your password
                immediately and contact our support team.
            </p>
    
            <p>
                Regards,<br>
                <b>SecureBank Security Team</b>
            </p>
        </div>
        `
    );
}

async function sendTransactionEmail(
    userEmail,
    name,
    amount,
    toAccount
){
    const subject = "Transaction Successful";

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color:#1a73e8;">Transaction Confirmation</h2>

        <p>Dear ${name},</p>

        <p>
            Your transaction has been processed successfully.
        </p>

        <div style="background:#f5f5f5; padding:15px; border-radius:8px;">
            <b>Transaction Details</b><br><br>

            Amount Transferred:
            <b>₹${amount}</b><br>

            Recipient Account:
            <b>${toAccount}</b><br>

            Transaction Time:
            <b>${new Date().toLocaleString()}</b><br>

            Status:
            <span style="color:green;"><b>SUCCESSFUL</b></span>
        </div>

        <p style="margin-top:20px;">
            If you did not authorize this transaction, please contact
            SecureBank support immediately.
        </p>

        <p>
            Regards,<br>
            <b>SecureBank Team</b>
        </p>
    </div>
    `;

    await sendEmail(
        userEmail,
        subject,
        `₹${amount} transferred successfully to account ${toAccount}`,
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
    const subject = "Transaction Failed";

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color:#d32f2f;">Transaction Failed</h2>

        <p>Dear ${name},</p>

        <p>
            We were unable to process your recent transaction.
        </p>

        <div style="background:#f5f5f5; padding:15px; border-radius:8px;">
            <b>Transaction Details</b><br><br>

            Amount Attempted:
            <b>₹${amount}</b><br>

            Recipient Account:
            <b>${toAccount}</b><br>

            Transaction Time:
            <b>${new Date().toLocaleString()}</b><br>

            Status:
            <span style="color:red;"><b>FAILED</b></span><br>

            Reason:
            <b>${reason}</b>
        </div>

        <p style="margin-top:20px;">
            No funds have been deducted from your account. Please verify the
            transaction details and try again.
        </p>

        <p>
            If you did not initiate this transaction, please contact
            SecureBank support immediately.
        </p>

        <p>
            Regards,<br>
            <b>SecureBank Team</b>
        </p>
    </div>
    `;

    await sendEmail(
        userEmail,
        subject,
        `Transaction of ₹${amount} to account ${toAccount} failed. Reason: ${reason}`,
        html
    );
}


module.exports = {sendRegsistrationEmail,sendLoginEmail,sendTransactionEmail,sendFailedTransactionEmail};