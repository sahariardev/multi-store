import React, {useEffect, useState} from "react";
import {updatePagerHeader} from "../store/myStoreSlice";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {getRequest, postRequest} from "../../Util";
import Url from "../../Url";
import {Chip} from 'primereact/chip';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {Checkbox} from 'primereact/checkbox';
import {updateLoader} from "../store/commonSlice";
import {Card} from 'primereact/card';
import {Toolbar} from 'primereact/toolbar';

const RoleView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    const [user, setUser] = useState();
    const [visible, setVisible] = useState();
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        dispatch(updatePagerHeader('Users'));
    });

    const fetchUserData = async () => {
        dispatch(updateLoader(true));
        const data = await getRequest(Url.userDetail + '/' + id);
        setUser(data);
        if (data && data.authorities) {
            setSelectedRoles([...data.authorities]);
        }
        dispatch(updateLoader(false));
    };

    useEffect(() => {
        fetchUserData();
        const fetchAllRoles = async () => {
            const data = await getRequest(Url.roleAssign);
            setRoles(data);
        };
        fetchAllRoles();

    }, []);

    const renderRole = (role) => {
        return <Chip label={role.name} key={role.id} className="margin-right-10"/>
    }

    const onRoleChange = (e) => {
        let _selectedRoles = [...selectedRoles];

        if (e.checked) {
            _selectedRoles.push(e.value);

        } else {
            _selectedRoles = _selectedRoles.filter(role => role.id !== e.value.id);
        }

        setSelectedRoles(_selectedRoles);
    }

    const updateRoles = async () => {
        dispatch(updateLoader(true));
        setVisible(false);
        const data = {
            userId: user.id,
            roles: selectedRoles.map(role => role.id)
        }
        await postRequest(Url.roleAssign, data);
        fetchUserData();
    }

    const bottomToolbar = () => {
        const startContent = (
            <React.Fragment>
                <Button label="Back" severity="secondary" onClick={() => navigate('/userList')}/>
            </React.Fragment>
        );

        const endContent = (
            <React.Fragment>
                <Button label="Add roles" onClick={() => setVisible(true)}/>
            </React.Fragment>
        );

        return (
            <div className="top-mar-30">
                <Toolbar start={startContent} end={endContent}/>
            </div>
        );
    }

    const dialogFooter = () => {
        return (
            <Button label="Submit" onClick={updateRoles}/>
        );
    }

    return (
        <div className="container">
            <Dialog header="Add Roles" footer={dialogFooter()} visible={visible} style={{width: '20vw'}}
                    onHide={() => setVisible(false)}>
                {roles.map((role) => {
                    return (
                        <div key={role.id} className="flex align-items-center bottom-mar-5">
                            <Checkbox inputId={role.id} name="role" value={role} onChange={onRoleChange}
                                      checked={selectedRoles.some((item) => item.id === role.id)}/>
                            <label htmlFor={role.id} className="ml-2">{role.name}</label>
                        </div>
                    );
                })}
            </Dialog>
            <Card>
                <div className="form-section">
                    <div className="row">
                        <div className="col-md-2">
                            Username
                        </div>
                        <div className="col-md-9">
                            {user && user.username}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2">
                            Firstname
                        </div>
                        <div className="col-md-9">
                            {user && user.firstname}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2">
                            Lastname
                        </div>
                        <div className="col-md-9">
                            {user && user.lastname}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
                            Store name
                        </div>
                        <div className="col-md-9">
                            {user && user.store && user.store.name}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
                            Store ID
                        </div>
                        <div className="col-md-9">
                            {user && user.store && user.store.id}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
                            Roles
                        </div>
                        <div className="col-md-9">
                            {user && user.authorities.map(role => renderRole(role))}
                        </div>
                    </div>
                </div>
            </Card>

            {bottomToolbar()}
        </div>
    );
}

export default RoleView;