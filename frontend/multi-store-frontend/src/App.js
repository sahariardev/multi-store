import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MyStore from './view/store/MyStore';
import MyStoreDetail from './view/store/MyStoreDetail';
import {Provider} from 'react-redux';
import store from './store';
import Navbar from "./Navbar";
import Header from "./Header";
import DoneView from "./view/done/DoneView";
import MyStoreList from "./view/store/MyStoreList";
import {useEffect, useState} from "react";
import Cookies from 'js-cookie';
import LoginView from "./Login";
import UserList from "./view/user/UserList";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

function App() {

    const [showLoginForm, setShowLoginForm] = useState(true);

    useEffect(() => {
        if (Cookies.get('token')) {
            setShowLoginForm(false);
        } else {
            setShowLoginForm(true);
        }
    });

    return (
        <div>
            {!showLoginForm &&<BrowserRouter>
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
                                    <Route path='/mystoreList' element={<MyStoreList/>}/>
                                    <Route path='/done' element={<DoneView/>}/>
                                    <Route path='/userList' element={<UserList/>}/>
                                </Route>
                            </Routes>
                        </div>
                    </div>
                </section>
            </Provider>
        </BrowserRouter>}
            {showLoginForm && <LoginView/>}
        </div>
    );
}

export default App;
