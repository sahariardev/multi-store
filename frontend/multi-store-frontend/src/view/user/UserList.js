import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {updatePagerHeader} from "../store/myStoreSlice";
import {getRequest} from "../../Util";
import Url from "../../Url";

import {SplitButton} from 'primereact/splitbutton';
import CustomDataTable from "../components/CustomDataTable";

const UserList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(updatePagerHeader('Users'));
    });

    const btnItems = [
        {
            label: 'Lock',
            icon: 'pi pi-times',
            command: () => {

            }
        }
    ];

    const updateRole = () => {

    };


    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getRequest(Url.userList);
            setUserList(data);
        };
        fetchData()
    }, []);

    const actionTemplate = (rowData) => {
        return <SplitButton label="Update Role" onClick={updateRole} model={btnItems} outlined/>;
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

    return (
        <div className="container">
            <CustomDataTable data={userList} columns={columns}/>
        </div>
    );
}

export default UserList;