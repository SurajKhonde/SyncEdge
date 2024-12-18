import createConnection from '../config/db';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { decode } from 'punycode';
import { logError } from './errorLogger';
dotenv.config();
const jwtscreate=process.env.jwtSecretKey;
if (!jwtscreate) {
    throw new Error("JWT Secret key is missing in the environment variables.");
  }
// check for IsUserExist
export const isUserExist =async(email: string, user_name: string): Promise<boolean> =>{
    try {
    const connection = await createConnection();  
    const checkUserExist = 'SELECT email, user_name FROM users WHERE email = ? OR user_name = ?';
    const [result] = await connection.query(checkUserExist, [email, user_name]);
    if (Array.isArray(result)) {
        return result.length > 0;
    }  
      return false; 
    } catch (error: any) {
      const errorLink =logError(error,'isUserExist', `Email: ${email}, User Name: ${user_name}`)
      console.error(`Error occurred. Check the error report here: ${errorLink}`);
      throw new Error('Failed to check user existence');
    }
  }
  //secure the Password
  export const bcryptPassword = async (password: string): Promise<string>=> {
    try {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword; 
    } catch (error:any) {
      const errorLink = logError(error, 'bcryptPassword', `Password: ${password}`);
      console.error(`Error occurred. Check the error report here: ${errorLink}`);
      throw new Error('Failed to process the password');
    }
  };
  //secure password 
  export const bcryptPasswordCompare = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error: any) {
      const errorLink = logError(error, 'bcryptPasswordCompare', `Password: ${password}, HashedPassword: ${hashedPassword}`);
      console.error(`Error occurred. Check the error report here: ${errorLink}`);
      throw new Error('Failed to process the password')
    }
  };
  //JwtToken create
  export const jwttokenCreate =(userId:number):string=>{
     const token = jwt.sign({ id:userId }, jwtscreate, { expiresIn: '1h' });
     return token;

  }
   //verify Jwtkey
   export const verifyJwt = (token: string):any => {
     try {
       const decoded = jwt.verify(token, jwtscreate)
       return decoded
     
     } catch (error:any) {
      const errorLink = logError(error, 'verifyJwt', `Token: ${token}`);
    console.error(`Error occurred. Check the error report here: ${errorLink}`);
    throw new Error('Invalid or expired token');
     }
   };
  //referal Code genrator
  export const refferalCodeGenrator = async (): Promise<string> => {
    const getRandomLetter = (): string => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomIndex = Math.floor(Math.random() * letters.length);
      return letters[randomIndex];
    };
    const getRandomDigit = (): string => {
      const digits = '0123456789';
      const randomIndex = Math.floor(Math.random() * digits.length);
      return digits[randomIndex];
    };
    const generateReferralCode = (): string => {
      const randomLetters = `${getRandomLetter()}${getRandomLetter()}`;
      const randomDigits = `${getRandomDigit()}${getRandomDigit()}`;
      return `SE${randomLetters}${randomDigits}`;
    };
    const connection = await createConnection();
    const referralCode = generateReferralCode();
    const checkUserExist = 'SELECT * FROM users WHERE refer_id = ?';
    const [result] = await connection.query(checkUserExist, [referralCode]);
  
    if (Array.isArray(result) && result.length > 0) {
      return generateReferralCode();
    } else {
      return referralCode;
    }
  };
export const genrateOtp=async():Promise<string> =>{
   let randomSixDigitOtp = "";
   for (let i=0;i<6;i++){
    let randomNumber = Math.floor(Math.random()*9)+1;
    randomSixDigitOtp+=randomNumber.toString(); 
   }  
   return randomSixDigitOtp
}
//InsertionOtp
export const otpProccessor =async(email:string,otp:string):Promise<boolean> =>{
  try {
    const storeOtp ='INSERT otp_storage(user_email,otp_hash) VALUES(?,?)'
    const connection = await createConnection();
    const hashOpt=bcryptPassword(otp)
    const [result]:any =await connection.query(storeOtp,[email,hashOpt])
    return true;
  } catch (error:any) {
    const errorLink = logError(error, 'otpProccessor', `Email: ${email}`);
    console.error(`Error occurred. Check the error report here: ${errorLink}`);
    throw new Error('Somthing Wrong Happened in insert the Otp Database ');
  }
}
export const otpVerify =async(email:string,otp:string):Promise<boolean> =>{
  try {
    const getuserDetails ='SELECT otp_hash FROM otp_storage WHERE user_email=?'
    const connection = await createConnection();
    const [result]:any=await connection.query(getuserDetails,[email]);
    const hashedOtp = result[0].otp_hash;
    if(otp===hashedOtp){
      return true
    }
    else{
      return false
    }
  } catch (error:any) {
    const errorLink = logError(error,'otpVerify', `Email: ${email},OTP: ${otp}`);
    console.error(`Error occurred. Check the error report here: ${errorLink}`);
    throw new Error('Somthing Wrong Happened in insert the Otp Database ');
    
  }
}