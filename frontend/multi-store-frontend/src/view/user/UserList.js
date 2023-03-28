import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {updatePagerHeader} from "../store/myStoreSlice";
import {updateLoader} from "../store/commonSlice";
import {getLoggedInUserInfo, getRequest, hasRole} from "../../Util";
import Url from "../../Url";

import {SplitButton} from 'primereact/splitbutton';
import CustomDataTable from "../components/CustomDataTable";
import {Button} from "primereact/button";

const UserList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(updatePagerHeader('Users'));
    });

    const user = getLoggedInUserInfo();

    const btnItemsRenderer = (rowData) => {
        const btnItems = [
            {
                label: 'Lock',
                icon: 'pi pi-times',
                command: () => {

                }
            }
        ];

        if (hasRole('ATTENDANCE') || user.storeAdmin) {
            btnItems.push(
                {
                    label: 'Attendance',
                    icon: 'pi pi-calendar-plus',
                    command: () => {
                        navigate('/attendance/' + rowData.id);
                    }
                }
            );
        }

        return btnItems;
    }

    const updateRole = (rowData) => {
        navigate('/userRoleView/' + rowData.id);
    };

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        dispatch(updateLoader(true));
        const fetchData = async () => {
            const data = await getRequest(Url.userList);
            setUserList(data);
            dispatch(updateLoader(false));
        };
        fetchData();

    }, []);

    const actionTemplate = (rowData) => {
        return <SplitButton label="Update Role" onClick={() => updateRole(rowData)} model={btnItemsRenderer(rowData)} outlined/>;
    };

    const columns = [
        {
            field: 'id',
            header: 'User ID'
        },
        {
            field: 'username',
            header: 'User Name'
        },
        {
            field: 'firstname',
            header: 'First Name'
        },
        {
            field: 'lastname',
            header: 'Last name'
        },
        {
            body: actionTemplate,
            header: 'Action',
            type: 'button'
        },
    ];

    const renderAddNewBtn = () => {
        if (!user.storeAdmin) {
            return '';
        }

        return (
            <Button type="button" icon="pi pi-plus" style={{marginLeft: '10px'}} rounded
                    onClick={() => { navigate('/userForm');
                    }} data-pr-tooltip="Add new user"/>
        );
    }

    return (
        <div className="container">
            <CustomDataTable data={userList} columns={columns} renderAddNewBtn={renderAddNewBtn} emptyMessage="No user found"/>
        </div>
    );
}

export default UserList;