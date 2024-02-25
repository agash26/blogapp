import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react"
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/post/postSlice.js";

const UpdatePost = () => {
    const { postId } = useParams();
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageUploadError, setImageUploadError] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts({ id: currentUser._id, startIndex: 0, postId }))
            .unwrap()
            .then((action) => {
                setFormData(action.posts[0]);
                console.log(action.posts);
            })
            .catch(err => {
                setPublishError(err);
            });
    }, [currentUser._id]);

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError("Please Select an Image")
                return;
            }
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snap) => {
                    const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                }, (error) => {
                    setImageUploadError('Image Upload Failed (File must be less than 5 MB)')
                    setImageUploadProgress(null);
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        setFormData({ ...formData, image: downloadUrl });
                        setImageUploadProgress(null);
                    });
                }
            )
        } catch (err) {
            console.log(err);
        }
    }
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.errMsg);
            } else {
                setPublishError(null);
                // setFormData(...formData, data);
            }
        } catch (error) {
            setPublishError(error.errMsg);

        }
    }
    return (
        <div className="p-3 max-w-3-xl mx-auto min-h-screen">
            <h1 className="my-7 text-center font-semibold text-3xl">Update a Post</h1>
            <form className="flex flex-col gap-4" onSubmit={handlePostSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput placeholder="Title *" type="text" required id="title" className="flex-1" onChange={e => setFormData({ ...formData, title: e.target.value })} value={formData?.title} />
                    <Select onChange={e => setFormData({ ...formData, category: e.target.value })} value={formData?.category}>
                        <option value="uncategorized">Select a category</option>
                        <option value="mongo">MongoDB</option>
                        <option value="node">Node</option>
                        <option value="react">React</option>
                        <option value="js">Java Script</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput type='file' accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                    <Button type="button" gradientDuoTone="purpleToBlue" size="sm" outline onClick={handleUploadImage}>
                        {imageUploadProgress ?
                            <div className="w-16 h16">
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                            </div>
                            : 'Upload Image'
                        }
                    </Button>
                </div>
                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {
                    formData.image &&
                    <img
                        src={formData?.image}
                        alt='up-img' className="w-full h-72 object-cover" />
                }
                <ReactQuill theme="snow" placeholder="Type here...." className="h-72 mb-12" required onChange={(value) => setFormData({ ...formData, content: value })} value={formData?.content} />
                <Button type="submit" gradientDuoTone="purpleToPink" >Update</Button>
                {publishError && <Alert className="'mt-5" color='failure'>{publishError}</Alert>}
            </form >
        </div >
    )
}

export default UpdatePost