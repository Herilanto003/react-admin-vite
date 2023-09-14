import { createSlice } from '@reduxjs/toolkit'
import { userLogin } from './authActions';

const userToken = localStorage.getItem('userToken')
const userInfo = localStorage.getItem('userInfo')

const initialState = {
    loading: false,
    userInfo: userInfo !== null ? JSON.parse(userInfo) : null ,
    userToken: userToken !== null ? userToken : null,
    error: null,
    success: null,
    isConnected: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLogout: (state) => {
            localStorage.setItem('userToken', null);
            localStorage.setItem('userInfo', null);
            state.loading = false;
            state.userInfo = null ;
            state.userToken = null;
            state.error = null;
            state.success = null,
            state.isConnected = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(userLogin.fulfilled, (state, { payload }) => {
                state.loading = false
                state.userInfo = payload.users
                state.userToken = payload.access_token
                state.isConnected = true
            })
            .addCase(userLogin.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
                state.isConnected = false
            });
    }
    // {
    //     // login user
    //     // [userLogin.pending]: (state) => {
    //     //     state.loading = true
    //     //     state.error = null
    //     // },
    //     // [userLogin.fulfilled]: (state, { payload }) => {
    //     //     state.loading = false
    //     //     state.userInfo = payload.users
    //     //     state.userToken = payload.access_token
    //     //     state.isConnected = true
    //     // },
    //     // [userLogin.rejected]: (state, { payload }) => {
    //     //     state.loading = false
    //     //     state.error = payload
    //     //     state.isConnected = false
    //     // },

    // }
})

export const { userLogout } = authSlice.actions
export default authSlice.reducer