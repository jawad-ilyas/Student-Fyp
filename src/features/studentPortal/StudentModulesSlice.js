// StudentModulesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/courses";

// Thunk: fetch modules for a given course
export const fetchModulesByCourse = createAsyncThunk(
    "studentModules/fetchModulesByCourse",
    async (courseId, { rejectWithValue }) => {
        try {
            const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${studentInfo?.token}`,
                },
            };
            const response = await axios.get(`${API_URL}/${courseId}/modules`, config);
            return response.data.data; // array of modules
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch modules");
        }
    }
);

const studentModulesSlice = createSlice({
    name: "studentModules",
    initialState: {
        modules: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchModulesByCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModulesByCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = action.payload;
            })
            .addCase(fetchModulesByCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default studentModulesSlice.reducer;
