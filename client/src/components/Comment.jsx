import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectUserById } from "../redux/user/userSlice";

const Comment = ({comment}) => {
    const userById = useSelector(state => selectUserById(state, comment.userId));
    console.log("==",userById);
    useEffect(()=>{
console.log("in");
    },[comment]);
  return (
    <div>Comment</div>
  )
}

export default Comment