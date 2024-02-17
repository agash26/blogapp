import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart } from '../redux/user/userSlice'


const SignUp = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email) {
      return dispatch(signInFailure('Please fill All fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.errMsg));
      }
      if (res.ok) {
        // dispatch(signInSuccess(data));
        navigate('/sign-in');
      }
    } catch (err) {
      dispatch(signInFailure(err));
    }
  }
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/*left*/}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg'>Agash&apos;s</span>Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project for mern blog with flowbite, tailwind.
          </p>
        </div>
        {/*right*/}
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className=''>
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder='Username'
                id='username' onChange={handleChange} />
            </div>
            <div className=''>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder='name@xyz.com'
                id='email' onChange={handleChange} />
            </div>
            <div className=''>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder='Password'
                id='password' onChange={handleChange} />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {loading ? (
                <Spinner size='sm'>
                  <span className='pl-3'>loading...</span>
                </Spinner>
              ) : 'Sign Up'
              }
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to="/sign-in" className='text-blue-500'>Sign In</Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignUp