import { createSlice } from "@reduxjs/toolkit";

export const myStoreSlice = createSlice({
    name:"myStore",
    initialState:{
        value:null
    },
    reducers: {
        adopt : (state,action) =>{
            state.value = action.payload
        }
    }
});

export const {adopt} = myStoreSlice.actions;
export default myStoreSlice.reducer;