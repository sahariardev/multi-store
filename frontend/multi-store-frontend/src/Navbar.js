import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import {updatePagerHeader} from './view/store/myStoreSlice'
import {useSelector} from "react-redux";
const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pageHeader = useSelector(state => state.myStore.value)

    const navigateTo = (headerTitle, link) => {
        dispatch(updatePagerHeader(headerTitle));
        navigate(link);
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
                        <div className={pageHeader === 'Dashboard' ? 'nav-link active' : 'nav-link'} onClick={()=>{navigateTo('Dashboard','/')}}><i className="fa fa-adjust"/>Dashboard</div>
                    </li>

                    <li className="nav-item">
                        <div  className={pageHeader === 'Store' ? 'nav-link active' : 'nav-link'} onClick={()=>{navigateTo('Store','myStoreList')}}><i className="fa fa-inbox"/>Store</div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;