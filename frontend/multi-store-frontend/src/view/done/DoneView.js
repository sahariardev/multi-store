import { useEffect } from 'react';
import {useDispatch} from "react-redux";
import {updatePagerHeader} from '../store/myStoreSlice';
import {useSelector} from "react-redux";

const DoneView = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(updatePagerHeader('Done'));
    });
    const message = useSelector(state => state.donePage.message);

    return (<div>
        <div className="alert alert-success alert-custom">
            <h4 className="alert-title">Action Completed!</h4>
            <p>{message}</p>
        </div>
    </div>);
}

export default DoneView;