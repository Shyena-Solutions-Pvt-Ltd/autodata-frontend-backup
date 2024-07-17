import React, { forwardRef } from "react";
import { Typography } from "@material-ui/core";
import {
  FONT_SIZE,
  HEADER_FONT_SIZE,
} from "../../../../../config";

import MaterialTable from "material-table";
/* tslint:disable */
import {
  Paper,
} from "@material-ui/core";
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
  ViewColumn,
} from "@material-ui/icons";

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
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};


export default class CallSummary extends React.PureComponent {
  
  state = {
    data: this.props.data,
    parseCDRData: [],
  }

  componentDidMount() {
    this.parseCDRData(this.props.data);
  }

  
  render() {
    // const MyNewTitle = ({ text = "Table Title", variant = "h6" }) => (
     
    // );

    const toolbarOptions = ["ExcelExport"];
    const pageSettings = { pageSize: 20 };
    const sortSettings = { columns: [{ field: "count", direction: "Descending" }]};
    let treegrid;
    const toolbarClick = (args) => {
      if (treegrid && args.item.text === "Excel Export") {
        treegrid.excelExport();
      }
    };

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
          Call Summary
        </Typography>
        <br />
        <TreeGridComponent
          dataSource={this.state.parseCDRData}
          treeColumnIndex={1}
          childMapping="subtasks"
          allowPaging={true}
          pageSettings={pageSettings}
          allowSorting={true}
          sortSettings={sortSettings}
          allowExcelExport={true}
          toolbarClick={toolbarClick}
          ref={(g) => (treegrid = g)}
          toolbar={toolbarOptions}
          style={{ marginTop: 16, marginLeft: "1rem", flex: 3 }}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="callingnumber"
              headerText="Calling Number"
              width="100"
              textAlign="Left"
            ></ColumnDirective>
            <ColumnDirective
              field="callednumber"
              headerText="Called Number"
              width="100"
              textAlign="Left"
            ></ColumnDirective>
            <ColumnDirective
              field="count"
              headerText="Count"
              width="100"
              textAlign="Left"
            ></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Page, Toolbar, ExcelExport]} />
        </TreeGridComponent>
      </>
    );
  }

  async parseCDRData(data) {
    let parsedData = [];
    data.forEach((element) => {
      if (parsedData.some((item) => item.callingnumber === element.callingnumber && item.callednumber === element.callednumber)) {
        parsedData.forEach((item) => {
          if (item.callingnumber === element.callingnumber && item.callednumber === element.callednumber) {
            item.count = item.count + 1;
          }
        });
      } else {
        parsedData.push({
          callingnumber: element.callingnumber,
          callednumber: element.callednumber,
          count: 1
        });
      }
    });
    
    parsedData.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (value === null) {
          item[key] = "Unknown";
        }
      });
    });

    this.setState({ parseCDRData: parsedData })
  }
}