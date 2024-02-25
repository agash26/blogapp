import { useDispatch } from 'react-redux';
import { fetchPosts } from "../redux/post/postSlice";
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';

const PostPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    dispatch(fetchPosts({ slug }))
      .unwrap()
      .then(action => {
        setPost(action.posts[0]);
        setLoading(false);
      });
  }, [slug]);
  if (loading)
    return (
      <div className='flex justify-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post?.title}</h1>
      <Link to={`/search?category=${post?.category}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>{post?.category}</Button>
      </Link>
      <img src={post?.image} alt='post image' className='mt-10 p-3 max-h-[600px] w-full object-cover' />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
        <span>{(post?.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post?.content }} className='post-content p-3 max-w-2xl mx-auto w-full'>
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post?._id}/>
    </main>
  )
}

export default PostPage