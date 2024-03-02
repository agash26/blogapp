import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import { fetchPosts } from '../redux/post/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchPosts({ id: currentUser._id }))
      .unwrap()
      .then(action => {
        setPosts(action.posts);
      });
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Different kind of programming articles and tutorials are found here on topics like web development and programming languages.
        </p>
        <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>View All Posts</Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-screen-2xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts?.length > 0 && (
          <div className='flex flex-col gap-5'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to='/search' className='text-lg text-center text-teal-500 font-bold hover:underline'>View All Posts</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home