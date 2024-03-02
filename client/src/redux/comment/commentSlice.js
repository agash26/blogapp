import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
const commentsAdapter = createEntityAdapter()
const initialState = commentsAdapter.getInitialState({
    state: 'idle',
    error: null,
    lastMonthComments: 0,
    totalComments: 0,
    comments: null,
    loading: false,
});

export const addComment = createAsyncThunk('comments/addComment', async (params) => {
    // const { content, postId, userId } = params;
    const url = `/api/comment/create`;
    try {
        const res = await axios.post(url, params);
        return res.data;
    } catch (err) {
        console.error('Error while post comment:', err)
        throw err;
    }
})

export const fetchComments = createAsyncThunk('comments/fetchComments', async (params) => {
    let url = `/api/comment/getcomments`;
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
});

export const deleteComment = createAsyncThunk('comments/deleteComment', async (initialComments) => {
    try {
        const response = await axios.delete(`/api/comment/deletecomment`, { data: initialComments })
        if (response?.status === 200) return response.data;
    } catch (err) {
        console.error(err.message)
    }
});

export const likeComment = createAsyncThunk('comments/likeComment', async (params) => {
    try {
        const res = await axios.put('/api/comment/likecomment', params);
        return res.data;
    } catch (err) {
        console.error(err.message)

    }
})

export const editComment = createAsyncThunk('comments/editComment', async (params) => {
    try {
        const res = await axios.put('/api/comment/editcomment', params);
        return res.data;
    } catch (err) {
        console.error(err.message)

    }
})

const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        commentsFetchStart: (state) => {
            state.loading = true;
        },
        commentsFetchEnd: (state) => {
            state.loading = false;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchComments.fulfilled, (state) => {
                state.status = 'success';
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = 'fail'
                state.error = action.error.errMsg
            })
            .addCase(addComment.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(addComment.fulfilled, (state) => {
                state.status = 'success';
            })
            .addCase(addComment.rejected, (state, action) => {
                state.status = 'fail'
                state.error = action.error.errMsg
            })
            .addCase(deleteComment.fulfilled, (state) => {
                state.status = 'success';
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.status = 'fail'
                state.error = action.error.errMsg
            })
    }
})

export default commentSlice.reducer;