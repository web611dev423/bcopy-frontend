import { combineReducers } from '@reduxjs/toolkit';
// Import your reducers here
// import userReducer from './userSlice';
import contributorReducer from './contributorSlice';
import recruiterReducer from './recruiterSlice';
import categoryReducer from './categorySlice';
import programReducer from './programSlice';
import contributionReducer from './contributionSlice';
import jobReducer from './jobSlice';

const rootReducer = combineReducers({
  // Add your reducers here
  contributors: contributorReducer,
  recruiters: recruiterReducer,
  categories: categoryReducer,
  programs: programReducer,
  contributions: contributionReducer,
  jobs: jobReducer,
});

export default rootReducer;