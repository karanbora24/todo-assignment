import express from 'express';
const router=express.Router();
import { login, register } from '../controllers/user.controller.js';

// Route for user login
router.post('/login', login);

// Route for user register
router.post('/register', register);

export default router;