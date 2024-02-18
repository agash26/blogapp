import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [imageUploadError, setImageUploadError] = useState(null);
    const filePickerRef = useRef();
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
                    });
                }
            );
        }
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
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
                    defaultValue={currentUser.username} />
                <TextInput
                    type='text' id='email' placeholder='email'
                    defaultValue={currentUser.email} />
                <TextInput
                    type='text' id='password' placeholder='password' />
                <Button type='submit' gradientDuoTone="purpleToBlue" outline>Update</Button>
            </form>
            <div className='text-red-500 flex mt-5 justify-between'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}
