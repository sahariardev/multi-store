import {createSlice} from "@reduxjs/toolkit";

export const commonSlice = createSlice({
    name: "commonSlice",
    initialState: {
        showLoader: false
    },
    reducers: {
        updateLoader: (state, action) => {
            state.showLoader = action.payload
        }
    }
});

export const {updateLoader} = commonSlice.actions;
export default commonSlice.reducer;