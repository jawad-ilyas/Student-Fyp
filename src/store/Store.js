import { configureStore } from "@reduxjs/toolkit";
import studentAuthReducer from "../features/studentPortal/StudentAuthSlice";
import studentCoursesReducer from "../features/studentPortal/StudentCoursesSlice";
import studentModulesReducer from "../features/studentPortal/StudentModulesSlice";
import moduleDetailReducer from "../features/studentPortal/StudentModuleDetailSlice";
import compilerReducer from "../features/compiler/compilerSlice";
import QuestionsReducer from '../features/questionsSlice/QuestionsSlice';
import studentStatsReducer from "../features/studentPortal/StudentStatsSlice";
import submissionReducer from "../features/submissions/submissionSlice";
const store = configureStore({
    reducer: {
        studentAuth: studentAuthReducer,
        // ...other slices    
        studentCourses: studentCoursesReducer,
        studentModules: studentModulesReducer,
        moduleDetail: moduleDetailReducer,
        compiler: compilerReducer,
        Question: QuestionsReducer,
        studentStats: studentStatsReducer,
        submission: submissionReducer

    },
});

export { store }
