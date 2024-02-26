import express from 'express';
import { verifyToken } from "../utils/verifyUser.js";
import { createComment, deleteComment, editComment, getComments, likeComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getcomments', getComments);
router.put('/likecomment', verifyToken, likeComment);
router.put('/editcomment', verifyToken, editComment);
router.delete('/deletecomment', verifyToken, deleteComment);

export default router;
