import {createSlice} from "@reduxjs/toolkit";

export const donePageSlice = createSlice(
    {
        name: "donePage",
        initialState:{
            message:'Welcome to done page'
        },
        reducers : {
            updateDonePageContent : (state, ation) => {
                state.message = ation.payload.message
            }
        }
    }
);
export const {updateDonePageContent} = donePageSlice.actions;
export default donePageSlice.reducer;