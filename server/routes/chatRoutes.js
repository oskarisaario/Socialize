import express from "express";
import { verifyToken } from '../middleware/auth.js';
import { createChat, getChats, getChat } from "../controllers/chats.js";


const router = express.Router();

router.post('/createChat', verifyToken, createChat);
router.get('/:userId', verifyToken, getChats);
router.get('/find/:userId/:otherUserId', verifyToken, getChat)


export default router;