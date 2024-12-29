import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/questions";

// Async Thunks
export const fetchAllQuestions = createAsyncThunk(
    "questions/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/all`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch questions");
        }
    }
);

export const createQuestion = createAsyncThunk(
    "questions/create",
    async (questionData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/create`, questionData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create question");
        }
    }
);

export const updateQuestion = createAsyncThunk(
    "questions/update",
    async ({ id, questionData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/update/${id}`, questionData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update question");
        }
    }
);

export const deleteQuestionById = createAsyncThunk(
    "questions/deleteById",
    async (id, { rejectWithValue }) => {
        console.log("deleteQuestionById called into slice");
        try {
            await axios.delete(`${API_URL}/delete/${id}`);
            return id; // Return the ID of the deleted question
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete question");
        }
    }
);


export const searchQuestions = createAsyncThunk(
    "questions/search",
    async (queryParams, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(queryParams).toString();
            const response = await axios.get(`${API_URL}/search?${params}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to search questions");
        }
    }
);
export const fetchCategoriesAndTags = createAsyncThunk(
    "questions/fetchCategoriesAndTags",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/categories-tags`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch categories and tags");
        }
    }
);


// Fetch Single Question
export const fetchQuestionById = createAsyncThunk(
    "questions/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch question");
        }
    }
);
// Slice
const questionsSlice = createSlice({
    name: "questions",
    initialState: {
        questions: [],
        categories: [],
        tags: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All Questions
            .addCase(fetchAllQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(fetchAllQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Question
            .addCase(createQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.questions.push(action.payload);
                state.successMessage = "Question created successfully!";
            })
            .addCase(createQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Question
            .addCase(updateQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateQuestion.fulfilled, (state, action) => {
                state.loading = false;
                const updatedIndex = state.questions.findIndex(
                    (question) => question._id === action.payload._id
                );
                if (updatedIndex !== -1) {
                    state.questions[updatedIndex] = action.payload;
                }
                state.successMessage = "Question updated successfully!";
            })
            .addCase(updateQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // deleteQuestionById Question
            .addCase(deleteQuestionById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteQuestionById.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = state.questions.filter(
                    (question) => question._id !== action.payload
                );
                state.successMessage = "Question deleted successfully!";
            })
            .addCase(deleteQuestionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Search Questions
            .addCase(searchQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(searchQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchCategoriesAndTags.fulfilled, (state, action) => {
                state.categories = action.payload.categories;
                state.tags = action.payload.tags;
            })
            // Fetch single question
            .addCase(fetchQuestionById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchQuestionById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedQuestion = action.payload;
            })
            .addCase(fetchQuestionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default questionsSlice.reducer;
