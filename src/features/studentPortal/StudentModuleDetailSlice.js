// StudentModuleDetailSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/modules";

// GET /api/v1/modules/:moduleId
export const fetchSingleModule = createAsyncThunk(
    "moduleDetail/fetchSingleModule",
    async (moduleId, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                },
            };
            const response = await axios.get(`${API_URL}/${moduleId}`, config);
            return response.data.data; // the module doc with questions
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch module");
        }
    }
);

// POST /api/v1/modules/:moduleId/submit
export const submitModule = createAsyncThunk(
    "moduleDetail/submitModule",
    async ({ moduleId, solutions }, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                },
            };
            const response = await axios.post(
                `${API_URL}/${moduleId}/submit`,
                { solutions },
                config
            );
            return response.data; // success response
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to submit module");
        }
    }
);

const moduleDetailSlice = createSlice({
    name: "moduleDetail",
    initialState: {
        module: null,    // the single module doc
        loading: false,
        error: null,
        submitLoading: false,
        submitError: null,
        submitSuccess: null,
    },
    reducers: {
        clearSubmitState(state) {
            state.submitLoading = false;
            state.submitError = null;
            state.submitSuccess = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchSingleModule
            .addCase(fetchSingleModule.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.module = null;
            })
            .addCase(fetchSingleModule.fulfilled, (state, action) => {
                state.loading = false;
                state.module = action.payload;
            })
            .addCase(fetchSingleModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // submitModule
            .addCase(submitModule.pending, (state) => {
                state.submitLoading = true;
                state.submitError = null;
                state.submitSuccess = null;
            })
            .addCase(submitModule.fulfilled, (state, action) => {
                state.submitLoading = false;
                state.submitSuccess = "Submission successful!";
            })
            .addCase(submitModule.rejected, (state, action) => {
                state.submitLoading = false;
                state.submitError = action.payload;
            });
    },
});

export const { clearSubmitState } = moduleDetailSlice.actions;
export default moduleDetailSlice.reducer;
