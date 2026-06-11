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


module.exports = {sendRegsistrationEmail,sendLoginEmail};