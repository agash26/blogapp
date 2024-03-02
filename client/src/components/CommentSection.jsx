import { Alert, Button, Modal, ModalBody, ModalHeader, Textarea } from "flowbite-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { addComment, deleteComment, fetchComments, likeComment } from "../redux/comment/commentSlice"
import Comment from "./Comment"
import { HiOutlineExclamationCircle } from "react-icons/hi"

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [deleteCommentId, setDeleteCommentId] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [commentError, setCommentError] = useState('');
    const [modal, setModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(addComment({ content: comment, postId, userId: currentUser._id }))
            .unwrap()
            .then((action) => {
                setComment('');
                setCommentError('');
                setCommentList([action.comments, ...commentList]);
            })
            .catch(err => {
                setCommentError(err);
            })
    }
    useEffect(() => {
        dispatch(fetchComments({ postId }))
            .unwrap()
            .then((result) => {
                setCommentList(result.comments);
            })
    }, [postId]);

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            dispatch(likeComment({ commentId }))
                .unwrap()
                .then((action) => {
                    setCommentList(commentList.map(comment => {
                        return comment._id === commentId ? {
                            ...comment,
                            likes: action.likes,
                            numberOfLikes: action.numberOfLikes
                        } : comment;
                    }))
                })
        } catch (error) {
            console.log(error);
        }
    }

    const handleEdit = async (comment, editedContent) => {
        setCommentList(commentList.map(c =>
            c._id === comment._id ? { ...comment, content: editedContent } : c))
    }

    const handleDelete = async (commentId) => {
        setModal(false);
        dispatch(deleteComment({ commentId }))
            .unwrap()
            .then(() => {
                setCommentList(commentList.filter((c) => c._id !== commentId))
            })
    }

    return (
        <div>
            {currentUser ? (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Signed in as:</p>
                    <img className="h-5 w-5 object-cover rounded-full" src={currentUser.profilePicture} />
                    <Link to={'/dashboard?tab=profile'} className="text-xs text-cyan-600 hover:underline">
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>You Must be Signed in to comment.</p>
                    <Link to='/sign-in' className="text-xs text-cyan-600 hover:underline">
                        Sign In
                    </Link>
                </div>
            )
            }
            {currentUser &&
                <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
                    <Textarea placeholder="Add a comment..."
                        rows='3' maxLength='200'
                        onChange={e => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className="flex justify-between items-center mt-5">
                        <p className="text-gray-500">{200 - comment.length} characters remaining</p>
                        <Button outline gradientDuoTone='purpleToPink' type="submit"
                        >
                            Add Comment
                        </Button>
                    </div>
                    {commentError &&
                        <Alert color='failure'>
                            {commentError}
                        </Alert>
                    }
                </form>
            }
            {commentList.length === 0 ? (
                <p className="text-sm my-5"> No Comments Yet!</p>
            ) : (
                <div className="text-sm my-5 flex items-center gap-1">
                    <p>Comments</p>
                    <div className="border border-gray-400 oy-1 px-2 rounded-sm">
                        <p>{commentList.length}</p>
                    </div>
                </div>
            )}
            {
                commentList.map((comment) => (
                    <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit}
                        onDelete={(commentId) => {
                            setModal(true);
                            setDeleteCommentId(commentId);
                        }} />
                ))
            }
            <Modal show={modal} onClose={() => setModal(false)} popup size='md'>
                <ModalHeader>
                    <ModalBody>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                Are you sure you want to delete your acccount?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={() => handleDelete(deleteCommentId)}>Yes I&apos;m Sure</Button>
                                <Button color='gray' onClick={() => setModal(false)}>No, Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </ModalHeader>
            </Modal>
        </div>
    )
}
export default CommentSection;