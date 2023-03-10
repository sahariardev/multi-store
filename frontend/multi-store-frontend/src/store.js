import {configureStore} from '@reduxjs/toolkit';
import myStore from './view/store/myStoreSlice'

const store = configureStore({
    reducer: {myStore,}
});

export default store;