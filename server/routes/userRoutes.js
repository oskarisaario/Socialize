import express from 'express';
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  deleteUser
} from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUserFriends);
//patch for updating
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);
router.delete('/:id/deleteUser', verifyToken, deleteUser);


export default router;