import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import axios from "axios";

const initialState = {
    state: 'idle',
    error: null,
    lastMonthPosts: 0,
    totalPosts: 0,
    posts: null,
    loading: false,
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (params) => {
    const { id } = params;
    // const res = await axios.get(`/api/post/getposts?userId=${id}`);
    try {
        const res = await fetch(`/api/post/getposts?userId=${id}`, {
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
    name: "post",
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
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload.posts;
                state.lastMonthPosts = action.payload.lastMonthPosts;
                state.totalPosts = action.payload.totalPosts;
                state.status = 'success';
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'fail'
                state.error = action.error.errMsg
            })
    }
})

export const { postsFetchStart, postsFetchEnd } = postSlice.actions;
export default postSlice.reducer;