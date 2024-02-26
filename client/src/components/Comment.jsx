import { useSelector } from "react-redux"
import { selectUserById } from "../redux/user/userSlice";
import moment from 'moment';

const Comment = ({ comment }) => {
  const userById = useSelector(state => selectUserById(state, comment.userId));
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
        <p className="text-gray-500 mb-2">{comment.content}</p>
      </div>
    </div>
  )
}

export default Comment