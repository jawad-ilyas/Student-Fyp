// StudentAuthSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Example API URL for login
const API_URL = "http://localhost:5000/api/v1/auth";

// 1) Thunk: studentLogin
export const studentLogin = createAsyncThunk(
    "studentAuth/studentLogin",
    async (loginData, { rejectWithValue }) => {
        try {
            // POST /api/v1/auth/login
            // (This is a generic route; you might have /login-student if you separate student from teacher)
            const response = await axios.post(`${API_URL}/login`, loginData);
            console.log("responsse from the login")
            // The back end typically returns something like:
            // { statusCode, message, data: { _id, name, email, role, token } }
            // We'll just store response.data.data in Redux
            return response.data.data;
        } catch (error) {
            // If error, pass it to rejectWithValue
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);

const studentAuthSlice = createSlice({
    name: "studentAuth",
    initialState: {
        studentInfo: null,     // will store { _id, name, email, role, token } if successful
        loading: false,
        error: null,
    },
    reducers: {
        // 2) Logout action (optional for now):
        logout(state) {
            state.studentInfo = null;
            localStorage.removeItem("studentInfo");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(studentLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(studentLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.studentInfo = action.payload; // e.g. { _id, name, email, token, role: "student" }
                localStorage.setItem("studentInfo", JSON.stringify(action.payload));

            })
            .addCase(studentLogin.rejected, (state, action) => {
                state.loading = false;
                // action.payload might contain an error message
                state.error = action.payload;
            });
    },
});

export const { logout } = studentAuthSlice.actions;
export default studentAuthSlice.reducer;
