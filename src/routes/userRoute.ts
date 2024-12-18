import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { generateGoogleCode, GetuserDetails, loginUser, registerUser, sendOtpUser} from '../controller/auth/userOnboarding.Controller';
import { userAuthenticate,userRegistrationValidator } from '../middleware/userVerify';

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destDir = path.join(__dirname, "../public/kycImages");
    cb(null, destDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const router: Router = Router();

//=========================== Login =====================
router.post("/register",userRegistrationValidator,registerUser);
router.post('/login',loginUser)
router.get('/getQrcode2Fa',userAuthenticate,generateGoogleCode);
router.get('/getUserDerails',userAuthenticate,GetuserDetails)
router.post('/getOtp',sendOtpUser)

//=========================== Login =====================

export default router;
