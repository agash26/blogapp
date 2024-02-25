import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
const postsAdapter = createEntityAdapter()
const initialState = postsAdapter.getInitialState({
    state: 'idle',
    error: null,
    lastMonthPosts: 0,
    totalPosts: 0,
    posts: null,
    loading: false,
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (params) => {
    const { id, startIndex, postId } = params;
    let url = `/api/post/getposts`;

    try {
        const response = await axios.get(url, {
            params: {
                userId: id,
                ...(startIndex !== undefined && { startIndex: startIndex }),
                ...(postId !== undefined && { postId: postId }) // Conditionally include postId if it's defined
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPosts) => {
    const { postId, userId } = initialPosts;
    try {
        const response = await axios.delete(`/api/post/deletepost/${postId}/${userId}`)
        console.log(response);
        if (response?.status === 200) return initialPosts;
        return `${response?.status}: ${response?.errMsg}`
    } catch (err) {
        console.error(err.message)
    }
})


const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        postsFetchStart: (state) => {
            state.loading = true;
        },
        postsFetchEnd: (state) => {
            state.loading = false;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state) => {
                state.status = 'success';
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'fail'
                state.error = action.error.errMsg
            })
            .addCase(deletePost.fulfilled, (state) => {
                state.status = 'success';
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.status = 'fail'
                state.error = action.error.errMsg
            })
    }
})


export const selectAllPosts = (state) => state.post.posts;
export const { postsFetchStart, postsFetchEnd } = postSlice.actions;
export default postSlice.reducer;