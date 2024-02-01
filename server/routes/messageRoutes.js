import express from "express";
import { verifyToken } from '../middleware/auth.js';
import { createMessage, getMessages } from "../controllers/message.js";


const router = express.Router();

router.post('/createMessage', verifyToken, createMessage);
router.get('/getMessages/:chatId', verifyToken, getMessages);


export default router;