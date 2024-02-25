import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, fetchUsers } from "../redux/user/userSlice";
import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'flowbite-react'
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUsers = () => {
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userList, setUserList] = useState([]);
    const [totalUsers, setTotalUsers] = useState(null);
    const [userIdToDelete, setuserIdToDelete] = useState(null);
    const [lastMonthUsers, setLastMonthUsers] = useState(null);
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser.isAdmin) {
            dispatch(fetchUsers({ id: currentUser._id }))
                .unwrap()
                .then(action => {
                    setUserList(action.users);
                    setTotalUsers(action.totalUsers);
                    setLastMonthUsers(action.lastMonthUsers);
                    if (action.users?.length < 9) {
                        setShowMore(false);
                    }
                });
        }
    }, [currentUser, dispatch]);

    const handleShowMore = async () => {
        const startIndex = userList.length;
        dispatch(fetchUsers({ id: currentUser._id, startIndex })).unwrap()
            .then(action => {
                setUserList(prevUsers => [...prevUsers, ...action.users])
                setTotalUsers(action.totalUsers);
                setLastMonthUsers(action.lastMonthUsers);
                if (action.users?.length < 9) {
                    setShowMore(false);
                }
            });
    };

    const handleDeleteuser = async () => {
        setShowModal(false);
        dispatch(deleteUser({ deleteUserId: userIdToDelete, userId: currentUser._id }))
            .unwrap()
            .then(() => {
                setUserList(prev =>
                    prev.filter(user => user._id !== userIdToDelete)
                )
            })
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && userList?.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell><span>Edit</span></Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {userList?.map(user => (
                                <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/user/${user._id}`}>
                                            <img src={user.profilePicture} alt={user.title} className="w-20 h-10 object-cover bg-gray-500 rounded-full" />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell><Link className="dark:text-white text-gray-900" to={`/user/${user._id}`}>{user.username}</Link></Table.Cell>
                                    <Table.Cell>
                                        {user.email}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? <FaCheck className='text-green-600' /> : <FaTimes className='text-red-600' />}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className='text-teal-500 hover:underline' to={`/update-user/${user._id}`}>Edit</Link>
                                    </Table.Cell>
                                    <Table.Cell><span onClick={() => {
                                        setShowModal(true);
                                        setuserIdToDelete(user._id);
                                    }} className="cursor-pointer font-medium text-red-500 hover:underline">Delete</span></Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {
                        showMore && (
                            <button type='button' onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Show More</button>
                        )
                    }
                </>
            ) : (
                <p>You Have No Users</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <ModalHeader>
                    <ModalBody>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                Are you sure you want to delete this user?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleDeleteuser}>Yes I&apos;m Sure</Button>
                                <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </ModalHeader>
            </Modal>
        </div>
    )
}

export default DashUsers