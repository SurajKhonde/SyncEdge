import { Request, Response } from 'express';
import { isUserExist, bcryptPassword, bcryptPasswordCompare, jwttokenCreate, refferalCodeGenrator } from '../../utils/UtilityRoom';
import createConnection from '../../config/db';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import * as dotenv from 'dotenv';
import { sendOtpEmail } from '../../utils/Nodemailer';
dotenv.config();

interface RegisterRequestBody {
  email: string;
  password: string;
  user_name: string;
  name: string;
  role: string;
}
interface LoginUserBody{
    user_name:string;
    password:string;
}
interface Otpverifiction{
  email:string;
  
}
export const registerUser = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
    try {
        const connection = await createConnection();
        const { email, password, user_name, name, role } = req.body;
        const userExistInDatabase = await isUserExist(email, user_name);
        if (userExistInDatabase) {
            res.status(400).json({ message:res.__('userAlreadyExists') });
            return;
        }
        const userpasswordHash = await bcryptPassword(password);
        const userRefferalCode =await refferalCodeGenrator()
        const insertQuery = `INSERT INTO users (email, password, user_name, name, role,refer_id) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result]: any = await connection.query(insertQuery, [email, userpasswordHash, user_name, name, role,userRefferalCode]);
        res.status(201).json({
            message:res.__('userRegisteredSuccessfully'),
        });

    } catch (error: any) {
        console.error('Error during user registration:', error.message);
        res.status(500).json({ message:res.__('internalServerError') });
    }
};
export const loginUser=async(req:Request<{},{},LoginUserBody>,res:Response):Promise<void>=>{
    const {user_name,password}=req.body;
    const connection = await createConnection();
    const getUserName='SELECT * FROM users WHERE user_name =?'
    const [result]:any =await connection.query(getUserName,[user_name])
    if (result.length === 0) {
        res.status(404).json({ message:res.__("userNotFound") });
        return;
      }
      const AuthenticatePassword = await bcryptPasswordCompare(password, result[0].password);
     if(AuthenticatePassword){
    const token =jwttokenCreate(result[0].id)
    res.json(
        {message:res.__('userLoginSuccessfully'),
            token:token
     });
    }else{
        res.status(401).json({
            message:res.__('pleaseCheckMaybePasswordOrUsernameWrong'),
            status:false,
        })
    }
};
export const generateGoogleCode = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId; 
  try {
    const connection = await createConnection();
    const getGoogleCode = 'SELECT google_hash, google_ascii, email, mobile_number FROM users WHERE id = ?';
    const [result]: any = await connection.query(getGoogleCode, [userId]);

    if (result.length === 0) {
      res.status(404).json({ status: false, message: res.__('userNotFound') });
      return
    }
    const singleUser = result[0];
    const userEmail = singleUser.email;
    let secretAscii: string, secretKey: string;
    let otpauth_url: string;
    if (singleUser.google_hash) {
      secretAscii = singleUser.google_ascii;
      secretKey = singleUser.google_hash;
    } else {
      const secret = speakeasy.generateSecret({ length: 20 });
      const updateGoogleCode = 'UPDATE users SET google_auth_json=?, google_hash=?, google_ascii=? WHERE id=?';
      await connection.query(updateGoogleCode, [JSON.stringify(secret), secret.base32, secret.ascii, userId]);
      secretAscii = secret.ascii;
      secretKey = secret.base32;
    }
    if (userEmail) {
      otpauth_url = speakeasy.otpauthURL({
        secret: secretAscii,
        label: `syncEdge-${userEmail}`,
      });
    } else if (singleUser.mobile_number) {
      otpauth_url = speakeasy.otpauthURL({
        secret: secretAscii,
        label: `syncEdge-${singleUser.mobile_number}`,
      });
    } else {
       res.status(400).json({
        status: false,
        message: res.__('noEmailOrMobileNumberFound'),
      });
      return;
    }
    // Generate QR Code
    QRCode.toDataURL(otpauth_url, (qrErr, image_data) => {
      if (qrErr) {
        console.error(qrErr);
        res.status(500).json({
          status: false,
          message: res.__('errorGeneratingQRCode'),
        });
        return;
      }

      return res.send({
        status: true,
        message: res.__('codeGeneratedSuccessfully'),
        data: { qrCodeUrl: image_data, secretKey },
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: res.__('somethingWentWrongDuringProcess'),
    });
    return
  }
};
export const GetuserDetails =async (req:Request,res:Response): Promise<void> =>{
    const userId = req.userId; 
  try {
    const connection = await createConnection();
    const getUserName='SELECT email,user_name,role,refer_id FROM users WHERE id =?'
    const [result]:any =await connection.query(getUserName,[userId]);
    res.json({data:result[0],message:"User Data Fetced Successfully",status:true})
     return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: res.__('somethingWentWrongDuringProcess'),
    });
    return;
  }
};
export const sendOtpUser =async(req:Request<{},{},Otpverifiction>,res:Response):Promise<void> =>{
  const connection = await createConnection();
  const { email} = req.body;
  console.log(email,"hhhh")
  const userexistanceCheack ='SELECT * FROM users WHERE email =?'
  const [result]:any =await connection.query(userexistanceCheack,[email]);
 if (result.length>0){
  res.json({message:"emailAddress already exist please try to login or use another EmailAddress"})
  return;
 }
else{
   const  OTP =await sendOtpEmail(email);
   

   res.json({message:OTP,status:true})
}
};

