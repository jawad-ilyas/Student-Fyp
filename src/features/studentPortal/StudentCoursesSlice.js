import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Suppose your back end route for student courses is:
const API_URL = "http://localhost:5000/api/v1/students";

// Thunk to fetch the student’s enrolled courses
export const fetchStudentCourses = createAsyncThunk(
    "studentCourses/fetchStudentCourses",
    async (_, { rejectWithValue }) => {
        try {
            // If you need the token from localStorage or Redux:
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
         
            if (!studentInfo || !studentInfo.token) {
                throw new Error("No student token found in localStorage");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo.token}`,
                },
            };

            const response = await axios.get(`${API_URL}/courses`, config);
            // Expecting the backend to return { statusCode, message, data: [courses] }
            return response.data.data; // array of courses
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch student courses");
        }
    }
);


const studentCoursesSlice = createSlice({
    name: "studentCourses",
    initialState: {
        courses: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload; // the array of enrolled courses
            })
            .addCase(fetchStudentCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});





export default studentCoursesSlice.reducer;
