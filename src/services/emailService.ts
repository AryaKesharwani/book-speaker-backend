

// // Configure this with your email service details
// const transporter = nodemailer.createTransport({
//     host: 'smtp.example.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// export async function sendVerificationEmail(to: string, otp: string): Promise<void> {
//     const mailOptions = {
//         from: '"Your App" <noreply@yourapp.com>',
//         to: to,
//         subject: 'Email Verification',
//         text: `Your verification code is: ${otp}`,
//         html: `<b>Your verification code is: ${otp}</b>`
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log('Verification email sent');
//     } catch (error) {
//         console.error('Error sending verification email:', error);
//         throw new Error('Failed to send verification email');
//     }
// }



import nodemailer from 'nodemailer';

let testAccount: nodemailer.TestAccount;
let transporter: nodemailer.Transporter;

async function createTestAccount() {
  testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
  });
}

createTestAccount();

export async function sendVerificationEmail(to: string, otp: string): Promise<void> {
  const mailOptions = {
    from: '"Your App" <noreply@yourapp.com>',
    to: to,
    subject: 'Email Verification',
    text: `Your verification code is: ${otp}`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}