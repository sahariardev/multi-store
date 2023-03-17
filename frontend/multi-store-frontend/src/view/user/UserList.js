import DataTable from 'react-data-table-component';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {updatePagerHeader} from "../store/myStoreSlice";
import {dataTableStyles, getRequest} from "../../Util";
import Url from "../../Url";

const UserList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(updatePagerHeader('Users'));
    });

    const columns = [
        {
            width: '56px', // custom width for icon button
            style: {
                borderBottom: '1px solid #FFFFFF',
                marginBottom: '-1px',
            },
        },
        {
            name: 'User Id',
            selector: row => row.id,
            sortable: true,
            grow: 2,
            style: {
                color: '#202124',
                fontSize: '14px',
                fontWeight: 500,
            },
        },
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true,
            grow: 2,
            style: {
                color: '#202124',
                fontSize: '14px',
                fontWeight: 500,
            },
        },
        {
            name: 'First name',
            selector: row => row.firstname,
            sortable: true,
            style: {
                color: 'rgba(0,0,0,.54)',
            },
        },
        {
            name: 'Last Name',
            selector: row => row.lastname,
            sortable: true,
            style: {
                color: 'rgba(0,0,0,.54)',
            },
        },
        {
            allowOverflow: true,
            button: true,
            width: '56px',
        },
    ];

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getRequest(Url.userList);
            setUserList(data);
        };
        fetchData()
    }, []);

    return (
        <div className="container">
            <DataTable
                title=""
                columns={columns}
                data={userList}
                customStyles={dataTableStyles}
                highlightOnHover
                pointerOnHover
            />
        </div>
    );
}

export default UserList;