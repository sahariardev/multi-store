import {configureStore} from '@reduxjs/toolkit';
import myStore from './view/store/myStoreSlice'
import donePage from "./view/done/donePageSlice";

const store = configureStore({
    reducer: {myStore,donePage}
});

export default store;