import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {updatePagerHeader} from "../store/myStoreSlice";
import {updateLoader} from "../store/commonSlice";
import {getLoggedInUserInfo, getRequest} from "../../Util";
import Url from "../../Url";
import CustomDataTable from "../components/CustomDataTable";
import {SplitButton} from "primereact/splitbutton";
import {Button} from "primereact/button";
import React from "react";
import {Toolbar} from "primereact/toolbar";


const AttendanceList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    useEffect(() => {
        dispatch(updatePagerHeader('Users'));
    });

    const user = getLoggedInUserInfo();

    const btnItems = [
        {
            label: 'Lock',
            icon: 'pi pi-times',
            command: () => {

            }
        }
    ];


    const [attendanceList, setAttendanceList] = useState([]);

    const attendanceDataSerializer = (data) => {
        data.addedByUsername = '';
        data.approvedByUsername = '';
        data.deletedByUsername = '';

        if (data.addedBy) {
            data.addedByUsername = `${data.addedBy.firstname} ${data.addedBy.lastname} (${data.addedBy.username})`;
        }

        if (data.approvedBy) {
            data.approvedByUsername = `${data.approvedBy.firstname} ${data.approvedBy.lastname} (${data.approvedBy.username})`;
        }

        if (data.deletedBy) {
            data.deletedByUsername = `${data.deletedBy.firstname} ${data.deletedBy.lastname} (${data.deletedBy.username})`;
        }

        return data;
    }

    useEffect(() => {
        dispatch(updateLoader(true));
        const fetchAttendanceData = async () => {
            const data = await getRequest(Url.attendanceList + '/' + id);
            setAttendanceList(data.map(attendanceDataSerializer));
            dispatch(updateLoader(false));
        };
        fetchAttendanceData();

    }, []);


    const actionTemplate = (rowData) => {
        if (rowData.deleted) {
            return '';
        }

        const btnItems = [];

        if (rowData.type === 'UNAPPROVED_LEAVE') {
            btnItems.push({
                label: 'Approve',
                icon: 'pi pi-times',
                command: () => {

                }
            });
        }

        if (btnItems.length) {
            return <SplitButton label="Delete" onClick={() => { }} model={btnItems} outlined/>;
        } else {
            return <Button label="Delete" onClick={() => { }} outlined/>;
        }
    };

    const columns = [
        {
            field: 'id',
            header: 'Attendance ID'
        },
        {
            field: 'attendanceDate',
            header: 'Attendance Date'
        },
        {
            field: 'type',
            header: 'Record Type'
        },
        {
            field: 'createdAt',
            header: 'Created At'
        },
        {
            field: 'updatedAt',
            header: 'Updated At'
        },
        {
            field: 'addedByUsername',
            header: 'Added By'
        },
        {
            field: 'approvedByUsername',
            header: 'Approved By'
        },
        {
            field: 'deleted',
            header: 'Deleted'
        },
        {
            field: 'deletedByUsername',
            header: 'Deleted By'
        },
        {
            body: actionTemplate,
            header: 'Action',
            type: 'button'
        },

    ];


    const bottomToolbar = () => {
        const startContent = (
            <React.Fragment>
                <Button label="Back" severity="secondary" onClick={() => navigate('/userList')}/>
            </React.Fragment>
        );

        return (
            <div className="top-mar-30">
                <Toolbar start={startContent}/>
            </div>
        );
    }

    return (
        <div className="container">
            <CustomDataTable data={attendanceList} columns={columns} emptyMessage="No attendance found"/>
            {bottomToolbar()}
        </div>
    );
}

export default AttendanceList;