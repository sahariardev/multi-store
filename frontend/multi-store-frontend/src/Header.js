import {useSelector} from "react-redux";
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';

const Header = () => {
    const user = jwt_decode(Cookies.get('token'));
    const pageHeader = useSelector(state => state.myStore.value);
    const logout = () => {
        Cookies.remove('token');
        window.location.href = '/';
    }

    return (
        <div className="head">
            <div className="top">
                <div className="left">

                </div>
                <div className="right">
                    <div className="dropdown">
                        <button className="btn btn-info dropdown-toggle" id="userDropdown" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">{user.username}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="userDropdown">
                            {/*<a className="dropdown-item" href="#">profile</a>*/}
                            <a className="dropdown-item cursor-pointer" onClick={logout}>log out</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="left">
                    <h1>{pageHeader}</h1>
                </div>
            </div>
        </div>
    );
}

export default Header;