import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: 'https://www.blogtyrant.com/wp-content/uploads/2017/02/how-to-write-a-good-blog-post.png'
    },
    category: {
        type: String
    },
    slug: {
        type: String,
        required: true
    },
    content:{
        type: String
    }
}, { timestamps: true }
);

const Post = mongoose.model('post', postSchema);

export default Post;