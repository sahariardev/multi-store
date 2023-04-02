import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updatePagerHeader} from './view/store/myStoreSlice'
import {getLoggedInUserInfo, hasRole} from "./Util";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pageHeader = useSelector(state => state.myStore.value)

    const navigateTo = (headerTitle, link) => {
        dispatch(updatePagerHeader(headerTitle));
        navigate(link);
    }

    const user = getLoggedInUserInfo();

    const getStoreLink = () => {
        if (!user.superAdmin) {
            return '';
        }

        return (
            <li className="nav-item">
                <div className={pageHeader === 'Store' ? 'nav-link active' : 'nav-link'} onClick={() => {
                    navigateTo('Store', 'myStoreList')
                }}><i className="fa fa-inbox"/>Store
                </div>
            </li>
        );
    }

    const getUserListLink = () => {
        if (!user.storeAdmin && !hasRole('ROLE_ASSIGN')) {
            return '';
        }

        return (
            <li className="nav-item">
                <div className={pageHeader === 'Users' || pageHeader ==='Users > Attendance' ? 'nav-link active' : 'nav-link'} onClick={() => {
                    navigateTo('Users', 'userList')
                }}><i className="fa fa-inbox"/>Users
                </div>
            </li>
        );
    }

    const getAttendanceLink = () => {
        return (
            <li className="nav-item">
                <div className={pageHeader === 'Attendance' ? 'nav-link active' : 'nav-link'} onClick={() => {
                    navigateTo('Attendance', 'attendance')
                }}><i className="fa fa-inbox"/>Attendance
                </div>
            </li>
        );
    }

    return (
        <div className="sidebar">
            <div className="head">
                <div className="logo">

                </div>
            </div>
            <div id="list">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <div className={pageHeader === 'Dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => {
                            navigateTo('Dashboard', '/')
                        }}><i className="fa fa-adjust"/>Dashboard
                        </div>
                    </li>

                    {getStoreLink()}
                    {getUserListLink()}
                    {getAttendanceLink()}
                </ul>
            </div>
        </div>
    );
}

export default Navbar;