import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const runCode = createAsyncThunk(
    "compiler/runCode",
    async ({ code, language, testCases }, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                },
            };
            // e.g. your new route uses a third-party judge or a new approach
            const response = await axios.post(
                "http://localhost:5000/api/v1/compiler/run",
                { code, language, testCases },
                config
            );
            // The shape of response.data might now have e.g. { output, passCount, totalCount, compile_output, etc. }
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to run code");
        }
    }
);

const compilerSlice = createSlice({
    name: "compiler",
    initialState: {
        runLoading: false,
        runError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(runCode.pending, (state) => {
                state.runLoading = true;
                state.runError = null;
            })
            .addCase(runCode.fulfilled, (state, action) => {
                state.runLoading = false;
                state.runError = null;
            })
            .addCase(runCode.rejected, (state, action) => {
                state.runLoading = false;
                state.runError = action.payload;
            });
    },
});

export default compilerSlice.reducer;
