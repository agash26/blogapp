import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
// import axios from "axios";
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
    const { id, startIndex } = params;
    // const res = await axios.get(`/api/post/getposts?userId=${id}`);
    try {
        const res = await fetch(`/api/post/getposts?userId=${id}&startIndex=${startIndex}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err.errMsg);
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
    }
})


export const selectAllPosts = (state) => state.post.posts;
export const { postsFetchStart, postsFetchEnd } = postSlice.actions;
export default postSlice.reducer;