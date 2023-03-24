import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {updatePagerHeader} from "../store/myStoreSlice";
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {getRequest, postRequest} from "../../Util";
import Url from "../../Url";
import {updateLoader} from "../store/commonSlice";
import {updateDonePageContent} from "../done/donePageSlice";

const UserForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [storeList, setStoreList] = useState([]);
    useEffect(() => {
        dispatch(updatePagerHeader('Users'));
        dispatch(updateLoader(true));
        const fetchData = async () => {
            const data = await getRequest(Url.accessibleStoreList);
            setStoreList(data);
            dispatch(updateLoader(false));
        };

        fetchData();

    }, []);

    const bottomToolbar = () => {
        const startContent = (
            <React.Fragment>
                <Button label="Back" severity="secondary" onClick={() => navigate('/userList')}/>
            </React.Fragment>
        );

        const endContent = (
            <React.Fragment>
                <Button label="Submit" onClick={submitForm}/>
            </React.Fragment>
        );

        return (
            <div className="top-mar-30">
                <Toolbar start={startContent} end={endContent}/>
            </div>
        );
    }

    const submitForm = async () => {
        const data = {
            username: username,
            password: password,
            repeatPassword: repeatPassword,
            storeId: store,
            firstname: firstname,
            lastname: lastname
        }

        const errorSetters = {
            username: setUsernameError,
            password: setPasswordError,
            repeatPassword: setRepeatPasswordError,
            storeId: setStoreError,
            firstname: setFirstNameError,
            lastname: setLastNameError
        }

        dispatch(updateLoader(true));
        const response = await postRequest(Url.userCreate, data, errorSetters);
        dispatch(updateLoader(false));

        if (response.id) {
            dispatch(updateDonePageContent({
                message: `User created with id : ${response.id}`,
                backBtnUrl: '/userList'
            }));
            navigate('/done');
        }
    }

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState();

    const [firstname, setFirstname] = useState();
    const [firstnameError, setFirstNameError] = useState('');

    const [lastname, setLastname] = useState();
    const [lastnameError, setLastNameError] = useState('');

    const [password, setPassword] = useState();
    const [passwordError, setPasswordError] = useState();

    const [repeatPassword, setRepeatPassword] = useState();
    const [repeatPasswordError, setRepeatPasswordError] = useState();

    const [store, setStore] = useState();
    const [storeError, setStoreError] = useState();

    return (
        <div className="container">
            <div className="card">
                <div className="form-group">
                    <label htmlFor="username" className="col-sm-3">Username</label>
                    <div className="col-sm-5">
                        <input type="text" id="username" className="form-control"
                               onChange={(e) => setUsername(e.target.value)} value={username}/>
                    </div>
                    {usernameError && (<div className="col-sm-5 form-error-message">{usernameError}</div>)}
                </div>

                <div className="form-group">
                    <label htmlFor="firstname" className="col-sm-3">First name</label>
                    <div className="col-sm-5">
                        <input type="text" id="firstname" className="form-control"
                               onChange={(e) => setFirstname(e.target.value)} value={firstname}/>
                    </div>
                    {firstnameError && (<div className="col-sm-5 form-error-message">{firstnameError}</div>)}
                </div>

                <div className="form-group">
                    <label htmlFor="lastname" className="col-sm-3">Last name</label>
                    <div className="col-sm-5">
                        <input type="text" id="lastname" className="form-control"
                               onChange={(e) => setLastname(e.target.value)} value={lastname}/>
                    </div>
                    {lastnameError && (<div className="col-sm-5 form-error-message">{lastnameError}</div>)}
                </div>

                <div className="form-group">
                    <label htmlFor="firstname" className="col-sm-3">Password</label>
                    <div className="col-sm-5">
                        <input type="text" id="firstname" className="form-control"
                               onChange={(e) => setPassword(e.target.value)} value={password}/>
                    </div>
                    {passwordError && (<div className="col-sm-5 form-error-message">{passwordError}</div>)}
                </div>

                <div className="form-group">
                    <label htmlFor="firstname" className="col-sm-3">Repeat Password</label>
                    <div className="col-sm-5">
                        <input type="text" id="firstname" className="form-control"
                               onChange={(e) => setRepeatPassword(e.target.value)} value={repeatPassword}/>
                    </div>
                    {repeatPasswordError && (<div className="col-sm-5 form-error-message">{repeatPasswordError}</div>)}
                </div>

                <div className="form-group">
                    <label htmlFor="control-demo-1" className="col-sm-3">Store</label>
                    <div className="col-sm-5">
                        <select className="form-control" onChange={(e) => setStore(e.target.value)}
                                value={store}>
                            <option key={0}>Please Select</option>
                            {storeList.map(store => {
                                return (<option key={store.id} value={store.id}>{store.name}</option>);
                            })}
                        </select>
                    </div>
                    {storeError && (<div className="col-sm-5 form-error-message">{storeError}</div>)}
                </div>

            </div>

            {bottomToolbar()}
        </div>

    );
}

export default UserForm;