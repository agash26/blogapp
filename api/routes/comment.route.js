import express from 'express';
import { verifyToken } from "../utils/verifyUser.js";
import { createComment, getComments } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getcomments', getComments)

export default router;
