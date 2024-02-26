import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        console.log(req.body)
        if (userId !== req.user.userId) {
            next(errorHandler(403, 'You are not allow to comment'));
        }
        const newComment = new Comment({
            content,
            postId,
            userId
        });
        await newComment.save();
        res.status(200).json(newComment);
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.query.postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.body.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment Not Found'));
        }
        const userIndex = comment.likes.indexOf(req.user.userId);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.userId);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);

    } catch (error) {
        next(error);
    }
}

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.body.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment Not Found'));
        }
        if (comment.userId !== req.user.userId && !req.user.isAdmin) {
            next(errorHandler(403, 'You are not allow to comment'));
        }
        const editedComment = await Comment.findByIdAndUpdate(
            req.body.commentId,
            {
                content: req.body.content,
            }, { new: true }
        );
        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        console.log(req);
        const comment = await Comment.findById(req.body.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment Not Found'));
        }
        if (comment.userId !== req.user.userId && !req.user.isAdmin) {
            next(errorHandler(403, 'You are not allow to comment'));
        }
        await Comment.findByIdAndDelete(req.body.commentId);
        res.status(200).json("Comment has been deleted");
    } catch (error) {
        next(error);
    }
}