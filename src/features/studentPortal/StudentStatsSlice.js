// features/studentPortal/StudentStatsSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchStudentStats = createAsyncThunk(
    "studentPortal/fetchStats",
    async (studentId, { rejectWithValue }) => {
        try {
            // e.g. include token if needed
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                },
            };
            const response = await axios.get(
                `http://localhost:5000/api/v1/students/${studentId}/stats`,
                config
            );
            return response.data.data; // { totalSolved, easyCount, mediumCount, hardCount, totalQuestions }
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch stats");
        }
    }
);
// Maybe your backend route is /api/v1/students/:studentId/solved
export const fetchStudentStatsOrStatus = createAsyncThunk(
    "studentPortal/fetchStatsOrStatus",
    async (_, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                },
            };

            const response = await axios.get(
                `http://localhost:5000/api/v1/students/${studentInfo._id}/stats`,
                config
            );
            return response.data.data;
            // e.g. {
            //   solvedQuestions: [ { question: "...", solvedAt: "..." }, ... ],
            //   totalSolved: 7,
            //   easyCount: 3,
            //   mediumCount: 3,
            //   hardCount: 1
            // }
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch student stats");
        }
    }
);
const studentStatsSlice = createSlice({
    name: "studentStats",
    initialState: {
        solvedQuestions: [],   // array of { question: questionId, solvedAt, etc. }

        totalSolved: 0,
        easyCount: 0,
        mediumCount: 0,
        hardCount: 0,
        totalQuestions: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentStats.fulfilled, (state, action) => {
                state.loading = false;
                const { totalSolved, easyCount, mediumCount, hardCount, totalQuestions } =
                    action.payload;
                state.totalSolved = totalSolved;
                state.easyCount = easyCount;
                state.mediumCount = mediumCount;
                state.hardCount = hardCount;
                state.totalQuestions = totalQuestions;
            })
            .addCase(fetchStudentStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchStudentStatsOrStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStudentStatsOrStatus.fulfilled, (state, action) => {
                state.loading = false;
                const {
                    solvedQuestions = [],
                    totalSolved,
                    easyCount,
                    mediumCount,
                    hardCount,
                } = action.payload;

                // Put them into Redux
                state.solvedQuestions = solvedQuestions;
                state.totalSolved = totalSolved || 0;
                state.easyCount = easyCount || 0;
                state.mediumCount = mediumCount || 0;
                state.hardCount = hardCount || 0;
            })
            .addCase(fetchStudentStatsOrStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default studentStatsSlice.reducer;
