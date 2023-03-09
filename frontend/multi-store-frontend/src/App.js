
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MyStore from './view/store/MyStore';
import MyStoreDetail from './view/store/MyStoreDetail';
import { Provider } from 'react-redux';
import store from './store';


function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route>
            <Route path='/mystore' element={<MyStore/>}/>
            <Route path='/mystoreDetail/:id' element={<MyStoreDetail/>}/>
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
