import {createSlice} from "@reduxjs/toolkit";

export const myStoreSlice = createSlice({
    name: "myStore",
    initialState: {
        value: 'Dashboard'
    },
    reducers: {
        updatePagerHeader: (state, action) => {
            state.value = action.payload
        }
    }
});

export const {updatePagerHeader} = myStoreSlice.actions;
export default myStoreSlice.reducer;