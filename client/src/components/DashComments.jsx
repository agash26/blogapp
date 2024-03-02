import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, fetchComments } from "../redux/comment/commentSlice";
import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'flowbite-react'
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashComments = () => {
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [totalComments, setTotalComments] = useState(null);
    const [commentIdToDelete, setcommentIdToDelete] = useState(null);
    const [lastMonthComments, setLastMonthComments] = useState(null);
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser.isAdmin) {
            dispatch(fetchComments({ userId: currentUser._id }))
                .unwrap()
                .then(action => {
                    setCommentList(action.comments);
                    setTotalComments(action.totalComments);
                    setLastMonthComments(action.lastMonthComments);
                    if (action.comments?.length < 9) {
                        setShowMore(false);
                    }
                });
        }
    }, [currentUser, dispatch]);

    const handleShowMore = async () => {
        const startIndex = commentList.length;
        dispatch(fetchComments({ id: currentUser._id, startIndex })).unwrap()
            .then(action => {
                setCommentList(prevComments => [...prevComments, ...action.comments])
                setTotalComments(action.totalComments);
                setLastMonthComments(action.lastMonthComments);
                if (action.comments?.length < 9) {
                    setShowMore(false);
                }
            });
    };

    const handleDeletecomment = async () => {
        setShowModal(false);
        dispatch(deleteComment({ deleteCommentId: commentIdToDelete, userId: currentUser._id }))
            .unwrap()
            .then(() => {
                setCommentList(prev =>
                    prev.filter(comment => comment._id !== commentIdToDelete)
                )
            })
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && commentList?.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Number of likes</Table.HeadCell>
                            <Table.HeadCell><span>Edit</span></Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {commentList?.map(comment => (
                                <Table.Row key={comment._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {new Date(comment.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.content}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className='text-teal-500 hover:underline' to={`/update-comment/${comment._id}`}>Edit</Link>
                                    </Table.Cell>
                                    <Table.Cell><span onClick={() => {
                                        setShowModal(true);
                                        setcommentIdToDelete(comment._id);
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
                <p>You Have No Comments</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <ModalHeader>
                    <ModalBody>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                Are you sure you want to delete this comment?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleDeletecomment}>Yes I&apos;m Sure</Button>
                                <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </ModalHeader>
            </Modal>
        </div>
    )
}

export default DashComments