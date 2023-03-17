import {useSelector} from "react-redux";
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';

const Header = () => {
    const user = jwt_decode(Cookies.get('token'));
    const pageHeader = useSelector(state => state.myStore.value)

    return (
        <div className="head">
            <div className="top">
                <div className="left">
                    <button id="on" className="btn btn-info"><i className="fa fa-bars"></i></button>
                    <button id="off" className="btn btn-info hide"><i className="fa fa-align-left"></i></button>
                    <button className="btn btn-info hidden-xs-down"><i className="fa fa-expand-arrows-alt"></i></button>
                    <button className="btn btn-info hidden-xs-down"><i className="fa fa-home"></i>Back Home</button>
                </div>
                <div className="right">
                    <div className="dropdown">
                        <button className="btn btn-info dropdown-toggle" id="userDropdown" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">{user.username}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="userDropdown">
                            <a className="dropdown-item" href="#">profile</a>
                            <a className="dropdown-item" href="#">log out</a>
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