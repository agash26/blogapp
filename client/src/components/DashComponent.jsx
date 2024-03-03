import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../redux/comment/commentSlice";
import { fetchUsers } from "../redux/user/userSlice";
import { fetchPosts } from "../redux/post/postSlice";
import { HiArrowNarrowDown, HiArrowNarrowUp, HiOutlineUserGroup } from 'react-icons/hi';
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashComponent() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser.isAdmin) {
            dispatch(fetchComments({ userId: currentUser._id }))
                .unwrap()
                .then(action => {
                    setComments(action.comments);
                    setTotalComments(action.totalComments);
                    setLastMonthComments(action.lastMonthComments);
                });
            dispatch(fetchUsers({ id: currentUser._id }))
                .unwrap()
                .then(action => {
                    console.log(action);
                    setTotalUsers(action.totalUsers);
                    setLastMonthUsers(action.lastMonthUsers);
                });
            dispatch(fetchPosts({ userId: currentUser._id }))
                .unwrap()
                .then(action => {
                    setPosts(action.posts);
                    setTotalPosts(action.totalPosts);
                    setLastMonthPosts(action.lastMonthPosts);
                });
        }
    }, [currentUser])
    return (
        <div className="p-3 md:mx-auto">
            <div className="flex-wrap flex gap-4 justify-center">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className={`${lastMonthUsers > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                            {lastMonthUsers > 0 ? (
                                <HiArrowNarrowUp />
                            ) : (
                                <HiArrowNarrowDown />
                            )}
                            {lastMonthUsers}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className={`${lastMonthComments > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                            {lastMonthComments > 0 ? (
                                <HiArrowNarrowUp />
                            ) : (
                                <HiArrowNarrowDown />
                            )}
                            {lastMonthComments}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
                            <p className="text-2xl">{totalPosts}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className={`${lastMonthPosts > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                            {lastMonthPosts > 0 ? (
                                <HiArrowNarrowUp />
                            ) : (
                                <HiArrowNarrowDown />
                            )}
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Users</h1>
                        <Link to={'/dashboard?tab=users'}>
                            <Button outline gradientDuoTone='purpleToPink'>
                                See All

                            </Button>
                        </Link>
                    </div>
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>User Image</TableHeadCell>
                            <TableHeadCell>Username</TableHeadCell>
                        </TableHead>
                        {users && users.map((user) => (
                            <TableBody key={user._id} className="divide-y">
                                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell>
                                        <img src={user.profilePicture}
                                            alt='user'
                                            className="h-10 w-10 rounded-full bg-gray-500" />
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Comments</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={'/dashboard?tab=comments'}>
                                See All
                            </Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Comment Content</TableHeadCell>
                            <TableHeadCell>Likes</TableHeadCell>
                        </TableHead>
                        {comments && comments.map((comment) => (
                            <TableBody key={comment._id} className="divide-y">
                                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell>
                                        <p className="line-clamp-2">{comment.content}</p>
                                    </TableCell>
                                    <TableCell>{comment.numberOfLikes}</TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Posts</h1>
                        <Link to={'/dashboard?tab=posts'}>
                            <Button outline gradientDuoTone='purpleToPink'>
                                See All
                            </Button>
                        </Link>
                    </div>
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Post Image</TableHeadCell>
                            <TableHeadCell>Post Title</TableHeadCell>
                            <TableHeadCell>Category</TableHeadCell>
                        </TableHead>
                        {posts && posts.map((post) => (
                            <TableBody key={post._id} className="divide-y">
                                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell>
                                        <img src={post.image}
                                            alt='post'
                                            className="h-10 w-14 rounded-md bg-gray-500" />
                                    </TableCell>
                                    <TableCell className="w-96">{post.title}</TableCell>
                                    <TableCell className="w-5">{post.category}</TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                    </Table>
                </div>
            </div>
        </div >
    )
}
