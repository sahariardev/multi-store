import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {useRef, useState} from "react";
import {FilterMatchMode} from "primereact/api";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

const CustomDataTable = (props) => {
    const dt = useRef(null);
    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({selectionOnly});
    };
    const [filters, setFilters] = useState({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search"/>
                </span>

                <Button type="button" icon="pi pi-file" style={{marginLeft: '10px'}} rounded
                        onClick={() => exportCSV(false)} data-pr-tooltip="CSV"/>
                {props.renderAddNewBtn && props.renderAddNewBtn()}
            </div>
        );
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderColumn = (column) => {
        if (column.type === 'button') {
            return <Column body={column.body} header={column.header}/>;
        } else {
            return <Column field={column.field} header={column.header}/>;
        }
    }

    const globalFilterFields = props.columns
        .filter(column => column.type !== 'button')
        .map(column => column.field);

    return (
        <div className="container">
            <DataTable ref={dt} value={props.data} paginator rows={10} filters={filters}
                       tableStyle={{minWidth: '50rem'}}
                       globalFilterFields={globalFilterFields} header={renderHeader()}
                       emptyMessage="No user found">
                {props.columns.map(column => renderColumn(column))}
            </DataTable>
        </div>
    );
}

export default CustomDataTable;