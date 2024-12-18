import { console } from "inspector";
import { genrateOtp } from "./UtilityRoom";

const nodemailer = require('nodemailer');
export const sendOtpEmail = async (userEmail:string) => {
  const otp = genrateOtp()
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP sent: ' + info.response);
    console.log(info,"hello user")
    return otp;
  } catch (error) {
    console.error('Error sending OTP: ', error);
  }
};

