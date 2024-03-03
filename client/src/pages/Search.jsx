import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from '../components/PostCard';
import { fetchPosts } from "../redux/post/postSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized'
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setLoading(true);
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    dispatch(fetchPosts({ sort: sortFromUrl, searchTerm: searchTermFromUrl, category: categoryFromUrl }))
      .unwrap()
      .then(action => {
        setPosts(action.posts);
        setLoading(false);
        if (action.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      setSidebarData({ ...sidebarData, sort: e.target.value || 'desc' });
    }
    if (e.target.id === 'category') {
      setSidebarData({ ...sidebarData, category: e.target.value || 'uncategorized' });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    dispatch(fetchPosts({ sort: sortFromUrl, searchTerm: searchTermFromUrl, category: categoryFromUrl, startIndex: posts.length }))
      .unwrap()
      .then(action => {
        setPosts([...posts, ...action.posts]);
        setLoading(false);
        if (action.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <div className="w-full">
              <TextInput placeholder="Search..." id='searchTerm' value={sidebarData.searchTerm} onChange={handleChange} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Sort:</label>
            <div className="w-full">
              <Select onChange={handleChange} id='sort' value={sidebarData.sort}>
                <option value="desc">Latest</option>
                <option value="asc">Oldest</option>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Category:</label>
            <div className="w-full">
              <Select onChange={handleChange} id='category' value={sidebarData.category}>
                <option value="uncategorized">Select a category</option>
                <option value="mongo">MongoDB</option>
                <option value="node">Node</option>
                <option value="react">React</option>
                <option value="js">Java Script</option>
              </Select>
            </div>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>Apply</Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Results:</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 &&
            <p className="text-gray-500 text-xl">No Results.</p>}
          {loading &&
            <p className="text-gray-500 text-xl">Loading...</p>}
          {!loading && posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && <button onClick={handleShowMore} className="text-teal-500 w-full text-lg p-7 hover:underline">Show More</button>}
        </div>
      </div>
    </div>
  )
}
