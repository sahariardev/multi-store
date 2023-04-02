import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {updatePagerHeader} from "../store/myStoreSlice";
import {updateLoader} from "../store/commonSlice";
import {formatDate, getLoggedInUserInfo, getRequest, postRequest} from "../../Util";
import Url from "../../Url";
import CustomDataTable from "../components/CustomDataTable";
import {SplitButton} from "primereact/splitbutton";
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {Dialog} from 'primereact/dialog';
import {Calendar} from 'primereact/calendar';

const MyAttendance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = getLoggedInUserInfo();
    const id = user.id;
    const pageHeader = 'Attendance'

    useEffect(() => {
        dispatch(updatePagerHeader(pageHeader));
    });

    const [attendanceList, setAttendanceList] = useState([]);

    const attendanceDataSerializer = (data) => {
        data.attendanceDate = formatDate(new Date(data.attendanceDate));
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

    const columns = [
        {
            field: 'id',
            header: 'Attendance ID'
        },
        {
            field: 'attendanceDate',
            header: 'Attendance Date',
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
        }
    ];

    const renderAddNewBtn = () => {
        return (
            <Button type="button" icon="pi pi-plus" style={{marginLeft: '10px'}} rounded
                    onClick={() => {
                        setVisible(true)
                    }} data-pr-tooltip="Create a leave request"/>
        );
    }

    const [visible, setVisible] = useState();
    const footerContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text"/>
            <Button label="Submit" icon="pi pi-check" onClick={() => {
                createAttendance()
            }} autoFocus/>
        </div>
    );

    const [attendanceDate, setAttendanceDate] = useState();
    const [serviceDateError, setServiceDateError] = useState();


    const createAttendance = async () => {
        const data = {
            forUser: id,
            type: 'UNAPPROVED_LEAVE'
        }

        if (attendanceDate) {
            data.attendanceDate = attendanceDate.toISOString();
        }

        const errorSetters = {
            attendanceDate: setServiceDateError
        }

        dispatch(updateLoader(true));
        const response = await postRequest(Url.createAttendance, data, errorSetters);

        if (response.id) {
            setVisible(false);
            const fetchAttendanceData = async () => {
                const data = await getRequest(Url.attendanceList + '/' + id);
                setAttendanceList(data.map(attendanceDataSerializer));
                dispatch(updateLoader(false));
            };
            fetchAttendanceData();
        } else {
            dispatch(updateLoader(false));
        }
    }

    return (
        <div className="container">
            <Dialog header="Create a leave request" visible={visible} style={{width: '50vw'}}
                    onHide={() => setVisible(false)} footer={footerContent}>
                <div className="m-0">
                    <div className="form-group">
                        <label htmlFor="serviceDate" className="col-sm-3">Service Date</label>
                        <div className="col-sm-5">
                            <Calendar type="text" id="serviceDate"
                                      onChange={(e) => setAttendanceDate(e.value)} value={attendanceDate}/>
                        </div>
                        {serviceDateError && (<div className="col-sm-5 form-error-message">{serviceDateError}</div>)}
                    </div>
                </div>
            </Dialog>

            <CustomDataTable data={attendanceList} columns={columns} renderAddNewBtn={renderAddNewBtn}
                             sortField="attendanceDate"
                             emptyMessage="No attendance found"/>
        </div>
    );
}

export default MyAttendance;