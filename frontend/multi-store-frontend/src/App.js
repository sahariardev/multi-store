
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MyStore from './view/store/MyStore';
import MyStoreDetail from './view/store/MyStoreDetail';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from "./Navbar";
import Header from "./Header";


function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
          <section id="admin">
              <Navbar/>
              <div className="content">
                  <Header/>
                  <div id="real">
                      <Routes>
                          <Route>
                              <Route path='/mystore' element={<MyStore/>}/>
                              <Route path='/mystoreDetail/:id' element={<MyStoreDetail/>}/>
                          </Route>
                      </Routes>
                  </div>
              </div>
          </section>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
