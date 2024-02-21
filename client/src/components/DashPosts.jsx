import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from "../redux/post/postSlice";
import { Link } from 'react-router-dom';
import { Table } from 'flowbite-react'

const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentUser.isAdmin) {
      dispatch(fetchPosts({ id: currentUser._id })).unwrap();
    }
  }, [currentUser._id]);
  const { posts: userPosts, lastMonthPosts, totalPosts } = useSelector(state => state.post);
  console.log(userPosts, lastMonthPosts, totalPosts);
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
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
              {userPosts.map(post => (
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
                  <Table.Cell><span className="font-medium text-red-500 hover:underline">Delete</span></Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/update-post/${post._id}`}>Edit</Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

          </Table>
        </>
      ) : (
        <p>You Have No Posts</p>
      )}
    </div>
  )
}

export default DashPosts