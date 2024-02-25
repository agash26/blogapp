import { Alert, Button, Textarea } from "flowbite-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { addComment, fetchComments } from "../redux/comment/commentSlice"
import Comment from "./Comment"

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [commentError, setCommentError] = useState('');
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(addComment({ content: comment, postId, userId: currentUser._id }))
            .unwrap()
            .then(() => {
                setComment('');
                setCommentError('');
            })
            .catch(err => {
                setCommentError(err);
            })
    }
    useEffect(() => {
        dispatch(fetchComments({ postId }))
            .unwrap()
            .then((result) => {
                setCommentList(result);
            })
    }, [postId]);

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
                    <Comment key={comment._id} comment={comment} />
                ))
            }
        </div>
    )
}
export default CommentSection;