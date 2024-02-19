import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    success: null
}

export const handleSignout = createAsyncThunk('user/signout', async () => {
    try {
        const res = await fetch('/api/user/signout', {
            method: 'POST',
            "Content-Type": "application/json"
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.errMsg);
        } else {
            return true;
        }
    } catch (err) {
        console.log(err.errMsg);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.success = null;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
            state.success = "update success";
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
            state.success = "delete success";
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = null;
        },
        emptyUserNotification: (state) => {
            state.success = null;
            state.error = null;
            state.loading = false;
        },
        signoutSuccess: (state) => {
            state.currentUser = null;
            state.success = null;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers(builder) {
        builder.addCase(handleSignout.fulfilled, (state) => {
            state.currentUser = null;
            state.success = null;
            state.error = null;
            state.loading = false;
            return;
        })
    }
})



export const { signoutSuccess, emptyUserNotification, signInFailure, signInSuccess, signInStart, updateFailure, updateStart, updateSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess } = userSlice.actions;

export default userSlice.reducer;