import {createSlice} from "@reduxjs/toolkit";

export const donePageSlice = createSlice(
    {
        name: "donePage",
        initialState: {
            message: 'Welcome to done page',
            backBtnUrl: '/'
        },
        reducers: {
            updateDonePageContent: (state, ation) => {
                state.message = ation.payload.message
                if(ation.payload.backBtnUrl) {
                    state.backBtnUrl = ation.payload.backBtnUrl
                }
            }
        }
    }
);
export const {updateDonePageContent} = donePageSlice.actions;
export default donePageSlice.reducer;