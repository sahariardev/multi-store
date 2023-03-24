import { useEffect } from 'react';
import {useDispatch} from "react-redux";
import {updatePagerHeader} from '../store/myStoreSlice';
import {useSelector} from "react-redux";
import React from "react";
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {useNavigate} from "react-router-dom";


const DoneView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(updatePagerHeader('Done'));
    });
    const message = useSelector(state => state.donePage.message);
    const backButtonLink = useSelector(state => state.donePage.backBtnUrl);

    const bottomToolbar = () => {

        const endContent = (
            <React.Fragment>
                <Button label="Done" onClick={() => {navigate(backButtonLink)}}/>
            </React.Fragment>
        );

        return (
            <div className="top-mar-30">
                <Toolbar end={endContent}/>
            </div>
        );
    }

    return (<div>
        <div className="container">
            <div className="card alert alert-success alert-custom">
                <h4 className="alert-title">Action Completed!</h4>
                <p>{message}</p>
            </div>

            {bottomToolbar()}
        </div>
    </div>);
}

export default DoneView;