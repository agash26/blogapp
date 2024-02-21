import { Alert, Button, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, emptyUserNotification, handleSignout, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashProfile() {
    const { currentUser, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageFileLoading, setImageFileLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const filePickerRef = useRef();
    const { error: errorMessage, success: successMessage } = useSelector(state => state.user);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    }
    useEffect(() => {
        const uploadImage = async () => {
            // service firebase.storage {
            //   match /b/{bucket}/o {
            //     match /{allPaths=**} {
            //       allow read;
            //       allow write: if 
            //       request.resource.size < 2*1024 &&
            //       request.resource.contentType.matches('image/.^')
            //     }
            //   }
            // }

            setImageFileLoading(true);
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '_' + imageFile.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            uploadTask.on(
                'state_changed',
                (snap) => {
                    const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('Image Upload Failed (File must be less than 5 MB)')
                    setImageUploadProgress(null);
                    setImageFile(null);
                    setImageFileUrl(null);
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        setImageFileUrl(downloadUrl);
                        setFormData({ ...formData, profilePicture: downloadUrl });
                        setImageUploadProgress(null);
                        setImageFileLoading(false);
                    });
                }
            );
        }
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    useEffect(() => {
        dispatch(emptyUserNotification());
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSumbit = async (e) => {
        e.preventDefault();
        if (Object.keys(formData).length === 0) {
            return;
        }
        if (imageFileLoading) {
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.errMsg));
            } else {
                dispatch(updateSuccess(data));
            }
        } catch (error) {
            dispatch(updateFailure(error.errMsg));
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })
            const data = await res.json();
            if (res.ok) {
                dispatch(deleteUserSuccess());
            } else {
                dispatch(deleteUserFailure(data.errMsg));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.errMsg));
        }
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSumbit}>
                <input type="file" id="profilePicture" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
                    {imageUploadProgress && <CircularProgressbar value={imageUploadProgress || 0} text={`${imageUploadProgress}%`}
                        strokeWidth={5}
                        styles={{
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            },
                            path: {
                                stroke: `rgba(62, 152, 199), ${imageUploadProgress / 100}%`
                            }
                        }}
                    />}
                    <img src={imageFileUrl || currentUser.profilePicture} alt="user" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
                </div>
                {imageUploadError &&
                    <Alert color='failure'>
                        {imageUploadError}
                    </Alert>
                }
                <TextInput
                    type='text' id='username' placeholder='username'
                    defaultValue={currentUser.username} onChange={handleChange} />
                <TextInput
                    type='text' id='email' placeholder='email'
                    defaultValue={currentUser.email} onChange={handleChange} />
                <TextInput
                    type='password' id='password' placeholder='password' onChange={handleChange} />
                <Button type='submit' gradientDuoTone="purpleToBlue" outline disabled={loading || imageFileLoading}>{loading ? 'loading...' : 'Update'}</Button>
                {currentUser.isAdmin &&
                    <Link to='/create-post'>
                        <Button
                            type='button'
                            gradientDuoTone='purpleToPink'
                            className='w-full'
                        >Create Post</Button>
                    </Link>}
            </form>
            <div className='text-red-500 flex mt-5 justify-between'>
                <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
                <span className='cursor-pointer' onClick={() => dispatch(handleSignout())}>Sign Out</span>
            </div>
            {errorMessage && (
                <Alert className='mt-5' color='failure'>
                    {errorMessage}
                </Alert>
            )}
            {successMessage && (
                <Alert className='mt-5' color='success'>
                    {successMessage}
                </Alert>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <ModalHeader>
                    <ModalBody>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                Are you sure you want to delete your acccount?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleDeleteUser}>Yes I&apos;m Sure</Button>
                                <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </ModalHeader>
            </Modal>
        </div >
    )
}
