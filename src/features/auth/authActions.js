import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../config/global";

export const userLogin = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            // configure header's Content-Type as JSON
            const config = {
                headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
            const { data } = await axios.post(
                `${BASE_URL}/api/user/login`,
                {
                    grant_type: '',
                    username: email,
                    password: password,
                    scope: '',
                    client_id: '',
                    client_secret: '',
                },
                config
            )
            console.log(data);
            // store user's token in local storage
            localStorage.setItem('userToken', data.access_token)
            localStorage.setItem('userInfo', JSON.stringify(data.users))
            return data
        } catch (error) {
            // return custom error message from API if any
            if (error.response && error.response.data.detail) {
                return rejectWithValue(error.response.data.detail)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const userLogout = createAsyncThunk(
    'auth/logout',
    () => {
        localStorage.setItem('userToken', null);
        localStorage.setItem('userInfo', null);

        return null
    }
)