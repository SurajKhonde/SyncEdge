import jwt, { JwtPayload, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { verifyJwt } from '../utils/UtilityRoom';
dotenv.config();
const JWT_SECRET = process.env.jwtSecretKey; 
if (!JWT_SECRET) {
  throw new Error("JWT Secret key is missing in the environment variables.");
}

export const userAuthenticate= (req: Request, res: Response, next: NextFunction):void => {
   
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
     res.status(401).json({ message: 'Token not provided' });
     return
  }
  try {
    const userId = verifyJwt(token)
    req.userId = userId.id;
    next();
  } catch (error: any) {
    res.status(401).json({ message: error.message });
    return
  }
};

export const userRegistrationValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password, user_name } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email format.' });
    return;
    
  }
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;
  if (!password || !passwordRegex.test(password)) {
       res.status(400).json({ 
      message: 'Password must be at least 7 characters long, contain at least one alphabet, and one special character.' 
    });
    return;
  }

  if (!user_name || user_name.trim().length < 3) {
    res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    return;
  }
  next();
};

