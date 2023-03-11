import DataTable from 'react-data-table-component';
import {useEffect, useState} from "react";
import Url, {getUrl} from "../../Url";
import {dataTableStyles} from "../../Util";
import {useDispatch} from "react-redux";
import {updatePagerHeader} from "./myStoreSlice";
import { useNavigate } from "react-router-dom";

const MyStoreList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(updatePagerHeader('Store'));
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
            name: 'Store ID',
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
            name: 'Store Name',
            selector: row => row.name,
            sortable: true,
            grow: 2,
            style: {
                color: '#202124',
                fontSize: '14px',
                fontWeight: 500,
            },
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
            style: {
                color: 'rgba(0,0,0,.54)',
            },
        },
        {
            name: 'Type',
            selector: row => row.type,
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

    const [storeList, setStoreList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch(getUrl(Url.storeList))
                .then((response) => response.json())
                .then(data => {
                    return data;
                });
            setStoreList(data);
        };

        fetchData()
    }, []);

    const navigateToStoreForm = () => {
        navigate('/myStore');
    }

    return (
        <div className="container">
            <DataTable
                title=""
                columns={columns}
                data={storeList}
                customStyles={dataTableStyles}
                highlightOnHover
                pointerOnHover
            />
            <div className="row footer-btn-container">
                <div className="col-sm-2">
                    <div className="btn btn-primary btn-block" onClick={() => navigateToStoreForm()}>
                        Create New Store
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyStoreList;

