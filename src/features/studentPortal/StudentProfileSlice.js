import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/students";

// Async thunk for fetching the student profile
export const getStudentProfile = createAsyncThunk(
    "studentProfile/getStudentProfile", // Slice and action type
    async (_, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo")); // Getting token for authorization
            if (!studentInfo || !studentInfo.token) {
                throw new Error("Authentication token not found.");
            }

            // console.log("studentInfo.token : ", studentInfo.token)
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo.token}`,
                },
            };
            // console.log("Axios Config:", config);

            const response = await axios.get(`${API_URL}/${studentInfo._id}/getStudentProfile`, config); // API call to fetch student profile
            return response.data.data; // Assuming backend sends profile under `data.data`
        } catch (error) {
            // Return error for rejection
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch student profile."
            );
        }
    }
);

export const updateStudentProfileImage = createAsyncThunk(
    "profile/updateStudentProfileImage",
    async (formData, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };
            const response = await axios.post(`${API_URL}/${studentInfo._id}/updateStudentProfileImage`, formData, config);
            return response.data?.data; // Assuming backend returns updated image URL
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update profile image.");
        }
    }
);

export const updateStudentProfile = createAsyncThunk(
    "profile/updateStudentProfile",
    async (formData, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                   
                },
            };
            console.log("formData : ", formData)
            const response = await axios.post(`${API_URL}/${studentInfo._id}/updateStudentProfile`, formData, config);
            return response.data?.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update profile image.");
        }
    }
);
// Define the initial state of the student profile
const initialState = {
    student: null, // Holds student profile details
    loading: false, // Loading state for async calls
    error: null, // Error message if any API call fails
};

// Create a Redux slice for the student profile
const studentProfileSlice = createSlice({
    name: "studentProfile",
    initialState,
    reducers: {
        // Clear profile action
        clearStudentProfile(state) {
            state.student = null; // Reset student data
            state.loading = false; // Reset loading state
            state.error = null; // Reset error state
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle pending state for fetching profile
            .addCase(getStudentProfile.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear previous errors
            })
            // Handle fulfilled state for fetching profile
            .addCase(getStudentProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.student = action.payload; // Set student data
            })
            // Handle rejected state for fetching profile
            .addCase(getStudentProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unable to fetch profile data.";
            })
            .addCase(updateStudentProfileImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudentProfileImage.fulfilled, (state, action) => {
                state.loading = false;
                state.imageUrl = action.payload;
            })
            .addCase(updateStudentProfileImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateStudentProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudentProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.student = action.payload; // Set student data
            })
            .addCase(updateStudentProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

// Export the actions and reducer
export const { clearStudentProfile } = studentProfileSlice.actions;
export default studentProfileSlice.reducer;
