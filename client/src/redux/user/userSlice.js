import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const usersAdapter = createEntityAdapter();
const initialState = usersAdapter.getInitialState({
    state: 'idle',
    currentUser: null,
    error: null,
    lastMonthUsers: 0,
    totalUsers: 0,
    loading: false,
    success: null
});

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (params) => {
    const { id, startIndex, userId } = params;
    let url = `/api/user/getusers`;

    try {
        const response = await axios.get(url, {
            params: {
                userId: id,
                ...(startIndex !== undefined && { startIndex: startIndex }),
                ...(userId !== undefined && { userId: userId }) // Conditionally include userId if it's defined
            }
        });
console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (initialUsers) => {
    const { deleteUserId } = initialUsers;
    try {
        const response = await axios.delete(`/api/user/delete/${deleteUserId}`)
        console.log(response);
        if (response?.status === 200) return initialUsers;
        return `${response?.status}: ${response?.errMsg}`
    } catch (err) {
        console.error(err.message)
    }
})

export const handleSignout = createAsyncThunk('user/signout', async () => {
    try {
        const res = await fetch('/api/user/signout', {
            method: 'USER',
            headers: {
                "Content-Type": "application/json"
            }
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
        builder
            .addCase(handleSignout.fulfilled, (state) => {
                state.currentUser = null;
                state.success = null;
                state.error = null;
                state.loading = false;
                return;
            })
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'success';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'fail'
                state.error = action.error.errMsg
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.status = 'success';
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'fail'
                state.error = action.error.errMsg
            })
    }
})


// Selector to get all users
export const selectAllUsers = (state) => usersAdapter.getSelectors().selectAll(state.user);

// Selector to get user by ID
export const selectUserById = (state, userId) => {
    const allUsers = selectAllUsers(state);
    console.log("===css", userId);
    return allUsers.find(user => user.id === userId);
};

export const { signoutSuccess, emptyUserNotification, signInFailure, signInSuccess, signInStart, updateFailure, updateStart, updateSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess } = userSlice.actions;

export default userSlice.reducer;