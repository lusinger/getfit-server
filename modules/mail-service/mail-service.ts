import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  port: 587, // port for secure SMTP
  tls: {
     ciphers:'SSLv3'
  },
  auth: {
      user: process.env.MAIL_ADRESS,
      pass: process.env.MAIL_PW,
  }
});

export const sendResetMail = async(reciever: string, payload: string) => {
  await transporter.sendMail({
    from: process.env.MAIL_ADRESS,
    to: reciever,
    subject: 'testmail',
    html: `
      <style>
        *{
          padding: 0px;
          margin: 0px;
          box-sizing: border-box;
        }
      </style>
      <div style="background: #112031; width: 100%; height: 100%; padding: 36px 18px; display: flex; flex-flow: column; align-items: center;">
        <h1 style="color: #FFCA0E">Reset Password</h1>
        <div style="width: 100%; margin-top: 9px; border-bottom: 1px solid #FFCA0E;"></div>
        <a href="http://localhost:4200/reset?access=${payload}" style="margin-top: 72px; text-decoration: none; width: 100%; height: 40px; display: flex; justify-content: center; align-items: center; background: #FFCA0E; color: #112031;">RESET</a>
      </div>
    `,
  });
};