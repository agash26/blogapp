import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, fetchPosts } from "../redux/post/postSlice";
import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'flowbite-react'
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPosts = () => {
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(null);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [lastMonthPosts, setLastMonthPosts] = useState(null);
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.isAdmin) {
      dispatch(fetchPosts({ id: currentUser._id }))
        .unwrap()
        .then(action => {
          setUserPosts(action.posts);
          setTotalPosts(action.totalPosts);
          setLastMonthPosts(action.lastMonthPosts);
          if (action.posts?.length < 9) {
            setShowMore(false);
          }
        });
    }
  }, [currentUser, dispatch]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    dispatch(fetchPosts({ id: currentUser._id, startIndex })).unwrap()
      .then(action => {
        setUserPosts(prevPosts => [...prevPosts, ...action.posts])
        setTotalPosts(action.totalPosts);
        setLastMonthPosts(action.lastMonthPosts);
        if (action.posts?.length < 9) {
          setShowMore(false);
        }
      });
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    dispatch(deletePost({ postId: postIdToDelete, userId: currentUser._id }))
      .unwrap()
      .then(() => {
        setUserPosts(prev =>
          prev.filter(post => post._id !== postIdToDelete)
        )
      })
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts?.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell><span>Edit</span></Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts?.map(post => (
                <Table.Row key={post.slug} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell><Link className="dark:text-white text-gray-900" to={`/post/${post.slug}`}>{post.title}</Link></Table.Cell>
                  <Table.Cell>
                    {post.category}
                  </Table.Cell>
                  <Table.Cell><span onClick={() => {
                    setShowModal(true);
                    setPostIdToDelete(post._id);
                  }} className="cursor-pointer font-medium text-red-500 hover:underline">Delete</span></Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/update-post/${post._id}`}>Edit</Link>
                  </Table.Cell>
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
        <p>You Have No Posts</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <ModalHeader>
          <ModalBody>
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete this post?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeletePost}>Yes I&apos;m Sure</Button>
                <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
              </div>
            </div>
          </ModalBody>
        </ModalHeader>
      </Modal>
    </div>
  )
}

export default DashPosts