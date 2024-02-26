import { useDispatch, useSelector } from "react-redux"
import { selectUserById } from "../redux/user/userSlice";
import moment from 'moment';
import { FaThumbsUp } from "react-icons/fa";
import { useState } from "react";
import { Button, Textarea } from "flowbite-react";
import { editComment } from "../redux/comment/commentSlice";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const userById = useSelector(state => selectUserById(state, comment.userId));
  const { currentUser } = useSelector(state => state.user)
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const dispatch = useDispatch();

  const handleEdit = () => {
    setEditing(true);
    setEditedContent(comment.content);
  }
  const handleSave = async () => {
    try {
      dispatch(editComment({ commentId: comment._id, content: editedContent }))
        .unwrap()
        .then(() => {
          setEditing(false);
          onEdit(comment, editedContent);
        })
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex shrink-0 mr-3">
        <img className="w-10 h-10 rounded-full bg-gray-200" src={userById.profilePicture} alt={userById.username} />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">{userById ? `@${userById.username}` : 'anonymous user'}</span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {editing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                outline
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
                }`} onClick={() => onLike(comment._id)}>
                <FaThumbsUp className='text-sm' />
              </button>
              <p>{
                comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
              }</p>
              {
                currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button type="button"
                      className="text-gray-400 hover:text-blue-500"
                      onClick={handleEdit}
                    >Edit</button>
                    <button type="button"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => onDelete(comment._id)}
                    >Delete</button>
                  </>
                )
              }
            </div>
          </>
        )
        }

      </div >
    </div >
  )
}

export default Comment