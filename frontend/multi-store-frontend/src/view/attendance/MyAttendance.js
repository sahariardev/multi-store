import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {updatePagerHeader} from "../store/myStoreSlice";
import {updateLoader} from "../store/commonSlice";
import {formatDate, getLoggedInUserInfo, getRequest, postRequest, queryParamConcator} from "../../Util";
import Url from "../../Url";
import CustomDataTable from "../components/CustomDataTable";
import {Button} from "primereact/button";
import {Dialog} from 'primereact/dialog';
import {Calendar} from 'primereact/calendar';

const MyAttendance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = getLoggedInUserInfo();
    const id = user.id;
    const pageHeader = 'Attendance'

    const [attendanceFilterVisible, setAttendanceFilterVisible] = useState(false);
    const [attendanceFilterDateFrom, setAttendanceFilterDateFrom] = useState();
    const [attendanceFilterDateTo, setAttendanceFilterDateTo] = useState();
    const [attendanceFilterType, setAttendanceFilterType] = useState('ALL');
    const [attendanceFilterDeleted, setAttendanceFilterDeleted] = useState('NO');

    useEffect(() => {
        dispatch(updatePagerHeader(pageHeader));
    });

    const [attendanceList, setAttendanceList] = useState([]);

    const getFetchUrl = () => {
        let queryParams = {};

        if (attendanceFilterDateFrom) {
            queryParams.attendanceDateFrom = attendanceFilterDateFrom.toISOString();
        }

        if (attendanceFilterDateTo) {
            queryParams.attendanceDateTo = attendanceFilterDateTo.toISOString();
        }

        if (attendanceFilterType) {
            queryParams.attendanceDateType = attendanceFilterType;
        }

        if (attendanceFilterDeleted) {
            queryParams.deleted = attendanceFilterDeleted === 'YES';
        }

        let url = Url.attendanceList + '/' + id;

        if (queryParams) {
            url = url + '?' + queryParamConcator(queryParams);
        }

        return url;
    }

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

    const fetchAttendanceData = async () => {
        dispatch(updateLoader(true));
        const data = await getRequest(getFetchUrl());
        setAttendanceList(data.map(attendanceDataSerializer));
        dispatch(updateLoader(false));
    };

    useEffect(() => {
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
                const data = await getRequest(getFetchUrl());
                setAttendanceList(data.map(attendanceDataSerializer));
                dispatch(updateLoader(false));
            };
            fetchAttendanceData();
        } else {
            dispatch(updateLoader(false));
        }
    }

    const footerContentForFilter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setAttendanceFilterVisible(false)}
                    className="p-button-text"/>
            <Button label="Filter" icon="pi pi-check" onClick={() => {
                setAttendanceFilterVisible(false);
                fetchAttendanceData()
            }} autoFocus/>
        </div>
    );

    const filterBtn = () => {
        return (
            <Button type="button" icon="pi pi-sliders-h" style={{marginLeft: '10px'}} rounded
                    onClick={() => {
                        setAttendanceFilterVisible(true)
                    }} data-pr-tooltip="Filter"/>
        );
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

            <Dialog header="Filter" visible={attendanceFilterVisible} style={{width: '50vw'}}
                    onHide={() => setAttendanceFilterVisible(false)} footer={footerContentForFilter}>
                <div className="m-0">
                    <div className="form-group">
                        <label htmlFor="serviceDateFrom" className="col-sm-3">Service Date From</label>
                        <div className="col-sm-5">
                            <Calendar type="text" id="serviceDateFrom"
                                      onChange={(e) => setAttendanceFilterDateFrom(e.value)}
                                      value={attendanceFilterDateFrom}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="serviceDateTo" className="col-sm-3">Service Date To</label>
                        <div className="col-sm-5">
                            <Calendar type="text" id="serviceDateFrom"
                                      onChange={(e) => setAttendanceFilterDateTo(e.value)}
                                      value={attendanceFilterDateTo}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="control-demo-1" className="col-sm-3">Attendance Type</label>
                        <div className="col-sm-5">
                            <select className="form-control" onChange={(e) => setAttendanceFilterType(e.target.value)}
                                    value={attendanceFilterType}>
                                <option value="ALL">ALL</option>
                                <option value="PRESENT">Present</option>
                                <option value="APPROVED_LEAVE">Approved leave</option>
                                <option value="UNAPPROVED_LEAVE">Unapproved leave</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="control-demo-1" className="col-sm-3">Select deleted</label>
                        <div className="col-sm-5">
                            <select className="form-control"
                                    onChange={(e) => setAttendanceFilterDeleted(e.target.value)}
                                    value={attendanceFilterDeleted}>
                                <option value="YES">Yes</option>
                                <option value="NO">No</option>
                            </select>
                        </div>
                    </div>

                </div>
            </Dialog>

            <CustomDataTable data={attendanceList} columns={columns} renderAddNewBtn={renderAddNewBtn}
                             sortField="attendanceDate"
                             filterBtn={filterBtn}
                             emptyMessage="No attendance found"/>
        </div>
    );
}

export default MyAttendance;