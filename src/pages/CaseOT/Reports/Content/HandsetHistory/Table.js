import React from 'react';
import Highcharts from "highcharts/";
import ReactHighcharts from "highcharts-react-official";
import xrange from 'highcharts/modules/xrange';
import HighchartsExporting from 'highcharts/modules/exporting';
import MaterialTable from "material-table";
import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper, Select,
  TextField,
  Typography,
  Slide,
  withStyles
} from '@material-ui/core';
import {
  Add,
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  Delete,
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
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import LuxonUtils from '@date-io/luxon';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import { forwardRef } from 'react';

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

  return (
    console.log('hand',props.data),
      <MaterialTable
      icons={tableIcons}
          //style={{ marginTop: 16, marginLeft:'3.8rem' }}          
          options={{
              grouping: false,              
              paging: true,
              pageSize: 5,
              actionsColumnIndex: -1,
              rowStyle: {
                  fontSize: 12
              },
              headerStyle:{
                  fontSize: 16,
              },
              search: true

          }}
          columns={[
              
              { title: "IMEI", field: 'imei', type: "numeric", align: "center", width: 16 },
              { title: "MSISDN", field: 'msisdn', type: "numeric", align: "center", width: 16 },
              { title: "Associate", field: '', type: "numeric", align: "center", width: 16 },
              { title: "Count", field: '', type: "numeric", align: "center", width: 16 },
              {
                title: "Start Date",
                field: "startTime",
                align: "center",
                render: rowData => moment.unix(rowData['startTime']/1000).format("DD/MM/YYYY"),
            },           
            {
                title: "End Date",
                field: "endTime",
                align: "center",
                render: rowData => moment.unix(rowData['endTime']/1000).format("DD/MM/YYYY"),
            },
              
              
          ]}
          data={props.data}
          title='HandSet Details'
          
          
      />
  );
};

const HandsetHistoryTable = (props) => {
return getTableComponent(props)
}


export default HandsetHistoryTable;