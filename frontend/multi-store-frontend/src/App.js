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
import { ProgressSpinner } from 'primereact/progressspinner';
//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";
import RoleView from "./view/user/RoleView";
import LoaderComponent from "./view/store/LoaderComponent";
import UserForm from "./view/user/UserForm";
import AttendanceList from "./view/attendance/AttendenceList";
import {getLoggedInUserInfo} from "./Util";
import PasswordResetView from "./view/PasswordResetView";
import MyAttendance from "./view/attendance/MyAttendance";

function App() {
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);

    useEffect(() => {
        if (Cookies.get('token')) {
            setShowLoginForm(false);

            const user = getLoggedInUserInfo();
            if (user.passwordReset) {
                setShowPasswordResetForm(true);
            } else {
                setShowPasswordResetForm(false);
            }

        } else {
            setShowLoginForm(true);
        }
    });

    return (
        <div>
            {!showLoginForm && !showPasswordResetForm &&<BrowserRouter>
            <Provider store={store}>
                <section id="admin">
                    <LoaderComponent/>
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
                                    <Route path='/userForm' element={<UserForm/>}/>
                                    <Route path='/userRoleView/:id' element={<RoleView/>}/>
                                    <Route path='/attendance/:id' element={<AttendanceList/>}/>
                                    <Route path='/attendance' element={<MyAttendance/>}/>
                                </Route>
                            </Routes>
                        </div>
                    </div>
                </section>
            </Provider>
        </BrowserRouter>}
            {showLoginForm && <LoginView/>}
            {showPasswordResetForm && <PasswordResetView/>}
        </div>
    );
}

export default App;
