import express from 'express';

import { 
    register, 
    login, 
    logout, 
    currentUser, 
    sendTestEmail,
    forgotPassword,
    resetPassword 
} from '../controllers/authControllers.js';

import { requireSignin } from '../middlewares/index.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/logout', logout);
router.get('/current-user', requireSignin, currentUser);
router.get('/send-email', sendTestEmail)

export default router;
