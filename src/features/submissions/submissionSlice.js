// src/features/submissions/submissionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/submissions";

// POST /api/v1/submissions/:moduleId
export const submitSubmission = createAsyncThunk(
    "submissions/submitSubmission",
    async ({ courseId, teacherId, moduleId, solutions }, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                },
            };

            const payload = {
                courseId, teacherId,
                moduleId,
                solutions, // Array of question submissions
            };

            const response = await axios.post(`${API_URL}/${studentInfo?._id}/submit`, payload, config);
            return response.data; // Backend response
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to submit module");
        }
    }
);

// GET /api/v1/submissions/:moduleId (Fetch submission details)
export const fetchSubmissionDetails = createAsyncThunk(
    "submissions/fetchSubmissionDetails",
    async (moduleId, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                },
            };
            const response = await axios.get(`${API_URL}/${moduleId}`, config);
            return response.data.data; // Submission data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch submission details");
        }
    }
);
// src/features/submissions/submissionSlice.js
export const fetchSubmissionsByCourse = createAsyncThunk(
    "submissions/fetchSubmissionsByCourse",
    async ({ courseId, moduleId }, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            console.log("moduleId of the submission ", moduleId)
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                },
            };

            const response = await axios.get(
                `http://localhost:5000/api/v1/submissions/course/${courseId}?moduleId=${moduleId}`,
                config
            );
            return response.data.data; // Submissions array
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch submissions.");
        }
    }
);
const submissionSlice = createSlice({
    name: "submissions",
    initialState: {
        submission: null, // Data about a specific submission
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearSubmissionState(state) {
            state.loading = false;
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Submit Module
            .addCase(submitSubmission.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(submitSubmission.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = "Submission successful!";
                state.submission = action.payload; // Save the submission response
            })
            .addCase(submitSubmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Submission Details
            .addCase(fetchSubmissionDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubmissionDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.submission = action.payload;
            })
            .addCase(fetchSubmissionDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSubmissionsByCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubmissionsByCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload;
            })
            .addCase(fetchSubmissionsByCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSubmissionState } = submissionSlice.actions;
export default submissionSlice.reducer;
