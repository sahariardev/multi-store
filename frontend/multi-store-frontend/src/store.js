import {configureStore} from '@reduxjs/toolkit';
import myStore from './view/store/myStoreSlice'
import donePage from "./view/done/donePageSlice";
import common from './view/store/commonSlice'

const store = configureStore({
    reducer: {myStore,donePage,common}
});

export default store;