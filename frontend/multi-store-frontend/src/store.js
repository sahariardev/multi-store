import { configureStore} from '@reduxjs/toolkit';
import {myStoreSlice} from './view/store/myStoreSlice'

const store = configureStore({
    reducer: {myStoreSlice}
});

export default store;