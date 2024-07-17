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





const HandsetHistoryXrange = (props) => {
    
  xrange(Highcharts);

  if (typeof Highcharts === 'object') {
      HighchartsExporting(Highcharts)
  }


  let imei = [];
  let msisdn = [];
  
  let startTime, endTime;

  let data = props.data.map((res) => {

      if(!imei.includes(res.imei)){
        imei.push(res.imei);
      }
      
      
      
      startTime = new Date(res.startTime);
      endTime = new Date(res.endTime);

      return {
          name: "HandSet History",
          x: Date.UTC(startTime.getFullYear(), startTime.getMonth(), startTime.getDate() ),
          x2: Date.UTC(endTime.getFullYear(), endTime.getMonth(), endTime.getDate() ),
          y: imei.indexOf(res.imei),
          label: `MSISDN: ${res.msisdn}`,
          
          
      }
  });

  let data1 = props.data.map((res) => {

    if(!imei.includes(res.imei)){
      imei.push(res.imei);
    }
    
    
    startTime = new Date(res.startTime);
    endTime = new Date(res.endTime);

    return {
        x: Date.UTC(startTime.getFullYear(), startTime.getMonth(), startTime.getDate() ),
        x2: Date.UTC(endTime.getFullYear(), endTime.getMonth(), endTime.getDate() ),
        y: imei.indexOf(res.imei),
        label: `MSISDN: ${res.msisdn}`,
        
        
        
    }
});
  
  


  let options = {
      chart: {
        type: 'xrange'
      },
      title: {
        text: 'Handset History - XGraph'
      },
      subtitle:{
        text: props.data.length? "" : "No Data Found"
      },
      accessibility: {
          point: {
            descriptionFormatter: function (point) {
              var ix = point.index + 1,
                category = point.yCategory,                
                from = new Date(point.x),
                to = new Date(point.x2);
              return ix + '. ' + category + ', ' + from.toDateString() +
                ' to ' + to.toDateString() + '.';
            }
          }
        },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'IMEI'
        },
        
        categories: imei,
        reversed: true
      },
      tooltip: {
        backgroundColor: '#c0c2c4',
        borderWidth: 0,
        shadow: false,
        useHTML: true,
        pointFormat: ' {point.label} '
    },
      series: [{
          name: 'IMEI',
          borderColor: 'black',
          pointWidth: 20,
          data: data1,
          states: {
            hover: {
                color: '#031f4f'
            }
        },
          dataLabels: {
          enabled: true
        }
      },
      
      
    ],
      
  }

  
  
        
  
  
  return <ReactHighcharts highcharts={Highcharts} options={options} />
  
}



export default HandsetHistoryXrange;
