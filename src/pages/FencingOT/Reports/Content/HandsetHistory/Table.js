import React from 'react';
import "../../../../../assets/styles/override_syncfusion.css";
import { Typography } from "@material-ui/core";

import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn
} from '@material-ui/icons';

import moment from 'moment';

import { forwardRef } from 'react';
import {
  ColumnsDirective,
  ColumnDirective,
  TreeGridComponent,
  Inject,
  Page,
  ExcelExport,
  Toolbar,
} from "@syncfusion/ej2-react-treegrid";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};




const getTableComponent = (props) => {
  
  const toolbarOptions = ["ExcelExport"];
  const pageSettings = { pageSize: 5 };
  let treegrid;
  const toolbarClick = (args) => {
    if (treegrid && args.item.text === "Excel Export") {
      treegrid.excelExport();
    }
  };

  const formattedData = props.data.map((item) => ({
    ...item,
    startTime: moment(item.startTime).format("DD-MMM-YYYY HH:mm:ss"),
    endTime: moment(item.endTime).format("DD-MMM-YYYY HH:mm:ss"),
  }));

  return (
    <>
      <Typography
          variant={"h1"}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          HandSet Details
      </Typography>
      <br />
      <TreeGridComponent
        dataSource={formattedData}
        treeColumnIndex={1}
        childMapping="subtasks"
        allowPaging={true}
        pageSettings={pageSettings}
        allowExcelExport={true}
        height="220"
        toolbarClick={toolbarClick}
        ref={(g) => (treegrid = g)}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="imei"
            headerText="IMEI"
            width="100"
            textAlign="Left"
          />
          <ColumnDirective
            field="imsi"
            headerText="IMSI"
            width="100"
            textAlign="Left"
          />
          <ColumnDirective
            field="msisdn"
            headerText="MSISDN"
            width="100"
            textAlign="Left"
          />
          <ColumnDirective
            field="associatedmsisdn"
            headerText="Associated MSISDN"
            width="100"
            textAlign="Left"
          />
          <ColumnDirective
            field="startTime"
            headerText="Start Date Time"
            width="100"
            textAlign="Left"
          />
          <ColumnDirective
            field="endTime"
            headerText="End Date Time"
            width="100"
            textAlign="Left"
          />
        </ColumnsDirective>
        <Inject services={[Page, Toolbar, ExcelExport]} />
      </TreeGridComponent>
      </>
  );
};

const HandsetHistoryTable = (props) => {
return getTableComponent(props)
}


export default HandsetHistoryTable;