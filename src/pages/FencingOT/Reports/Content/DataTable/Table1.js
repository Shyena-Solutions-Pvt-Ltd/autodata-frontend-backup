import React, { forwardRef } from "react";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Typography } from "@material-ui/core";
import {
  drawerWidth,
  DEFAULT_CASE_CHECK_OT,
  FONT_SIZE,
  HEADER_FONT_SIZE,
} from "../../../../../config";
import {
  ColumnsDirective,
  ColumnDirective,
  TreeGridComponent,
  Inject,
} from "@syncfusion/ej2-react-treegrid";
import {
  VirtualScroll,
  Filter,
  Freeze,
  Resize,
  Reorder,
  Page,
  Sort,
  PdfExport,
  ExcelExport,
  ColumnMenu,
  ContextMenu,
} from "@syncfusion/ej2-react-treegrid";
import "./sample2.css";
import { getCdrColumnName } from "../../../../getCdrColumns";
import MaterialTable from "material-table";
/* tslint:disable */
import {
  Button,
  Dialog,
  AppBar,
  Paper,
  IconButton,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Slide,
  withStyles,
} from "@material-ui/core";
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
  ViewColumn,
} from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";
import {
  getLinkedMsisdns,
  getUsingCellId,
  newgetLinkedMsisdns,
  newgetLinkedCdrs,
} from "../../../../../util/network";
import LuxonUtils from "@date-io/luxon";
var icons = `
.e-Pdf_Export:before {
    content:'\\e240';
}
.e-Excel_Export:before {
    content: '\\e242';
}
`;
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

const styles = (theme) => ({
  root: {
    fontSize: FONT_SIZE,
  },
  chip: {
    margin: theme.spacing(0.5),
    fontSize: FONT_SIZE,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: "100%",
    height: "100%",
    align: "center",
    fontSize: FONT_SIZE,
  },
  drawercontent: {
    padding: 32,
    fontSize: FONT_SIZE,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  appBar: {
    position: "relative",
    backgroundColor: "#18202c",
  },
  field: {
    fontSize: FONT_SIZE,
  },
});
export default class App extends React.PureComponent {
  state = {
    currentAccount: this.props.currentAccount,
    selectedJob: this.props.selectedJob,
    data: [],
    cdrdata: [],
    key: 1,
    loaderStatus: false,
    searchMsisdn: null,
    party1cdrs: null,
    party2cdrs: null,
    selectedMsisdn: null,
  };

  componentDidMount() {
    // console.log(this.props.selectedJob);
    if (this.props.selectedJob.type === "MSISDN Linked") {
      this.getMSISDNsData();
    } else if (this.props.selectedJob.type === "CellID Linked") {
      this.getCellIdLinkedData();
    }
  }

  render() {
    {
      // console.log(this.state);
    }
    const MyNewTitle = ({ text = "Table Title", variant = "h6" }) => (
      <Typography
        variant={variant}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </Typography>
    );
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        {this.state.selectedMsisdn !== null ? (
          <Paper
            style={{
              marginTop: 16,
              marginLeft: "1rem",
              flex: 1,
              overflowY: "scroll",
            }}
            elevation={4}
          >
            <div
              style={{
                padding: "16px",
                backgroundColor: "rgb(44, 64, 94)",
                color: "#ffffff",
              }}
            >
              MSISDN 1 CDR's
            </div>
            <table style={{ width: "100%" }}>
              <tbody>
                <div>
                  {this.state.cdrdata.map((cdr, i) => {
                    if (cdr.partyId === "Party-1") {
                      return (
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000000",
                            }}
                          >
                            <b>DateTime : </b>
                            {new Date(cdr.timeStamp).toLocaleString()}
                            <br />
                            <b>Cell ID : </b>
                            {cdr.cellId}
                            <br />
                            <b>Long/Lat : </b>
                            {cdr.locationLon},{cdr.locationLat}
                            <br />
                            <b>CGI : </b>
                            {cdr.cgi}
                            <br />
                            <b>EventType : </b>
                            {cdr.eventType}
                            <br />
                          </td>
                        </tr>
                      );
                    }
                  })}{" "}
                </div>
              </tbody>
            </table>
          </Paper>
        ) : (
          ""
        )}
        <MaterialTable
          icons={tableIcons}
          style={{ marginTop: 16, marginLeft: "1rem", flex: 3 }}
          components={{
            Container: (props) => <Paper {...props} elevation={4} />,
          }}
          options={{
            grouping: false,
            exportButton:
              this.state.currentAccount.modules.export ||
              this.state.currentAccount.designation === "Admin",
            exportAllData:
              this.state.currentAccount.modules.export ||
              this.state.currentAccount.designation === "Admin",
            exportFileName: "jobDataExport",
            paging: true,
            pageSize: 10,
            actionsColumnIndex: -1,
            rowStyle: {
              fontSize: FONT_SIZE,
            },

            headerStyle: {
              fontSize: HEADER_FONT_SIZE,
              backgroundColor: "#2c405e",
              color: "#FFF",
              //borderRight: '1px solid #000'
            },
            cellStyle: { borderRight: "1px solid #3d3c3a" },
          }}
          columns={[
            {
              title:
                this.state.selectedJob.type === "CellID Linked"
                  ? "Location 1"
                  : "MSISDN 1",
              field: "msisdn1",
            },
            { title: "Common MSISDN", field: "commonmsisdn" },
            {
              title:
                this.state.selectedJob.type === "CellID Linked"
                  ? "Location 2"
                  : "MSISDN 2",
              field: "msisdn2",
            },
          ]}
          data={
            this.state.data.length === 0 && this.state.loaderStatus
              ? [{ msisdn1: "", commonmsisdn: "Loading...", msisdn2: "" }]
              : this.state.data
          }
          title={<MyNewTitle variant="h5" text={this.state.selectedJob.type} />}
          onRowClick={(event, newVal) => {
            // console.log(parseInt(newVal.tableData.id));
            // console.log("Link ID" + newVal.linkId);
            this.getCdrData(newVal.linkId);
            this.setState({
              selectedMsisdn: parseInt(newVal.tableData.id),
            });
          }}
        />
        {this.state.selectedMsisdn !== null ? (
          <Paper
            style={{
              marginTop: 16,
              marginLeft: "1rem",
              flex: 1,
              overflowY: "scroll",
            }}
            elevation={4}
          >
            <div
              style={{
                padding: "16px",
                backgroundColor: "rgb(44, 64, 94)",
                color: "#ffffff",
              }}
            >
              MSISDN 2 CDR's
            </div>
            <table style={{ width: "100%" }}>
              <tbody>
                <div>
                  {this.state.cdrdata.map((cdr, i) => {
                    // console.log(cdr);
                    if (cdr.partyId === "Party-2") {
                      return (
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000000",
                              width: "100%",
                            }}
                          >
                            <b>DateTime : </b>
                            {new Date(cdr.timeStamp).toLocaleString()}
                            <br />
                            <b>Cell ID : </b>
                            {cdr.cellId}
                            <br />
                            <b>Long/Lat : </b>
                            {cdr.locationLon},{cdr.locationLat}
                            <br />
                            <b>CGI : </b>
                            {cdr.cgi}
                            <br />
                            <b>EventType : </b>
                            {cdr.eventType}
                            <br />
                          </td>
                        </tr>
                      );
                    }
                  })}{" "}
                </div>
              </tbody>
            </table>
          </Paper>
        ) : (
          ""
        )}
      </div>
    );
  }

  async getCdrData(linkId) {
    try {
      if (this.state.selectedJob.query && this.state.selectedJob.query1) {
        let data = await newgetLinkedCdrs(this.state.selectedJob.id, linkId);
        this.setState({
          cdrdata: data.results,
        });
      }
    } catch (error) {
      console.log({ ...error });
      console.log("Error", error.message);
      this.setState({ loaderStatus: false });
    }
  }

  async getMSISDNsData() {
    try {
      if (this.state.selectedJob.query && this.state.selectedJob.query1) {
        this.setState({
          loaderStatus: true,
        });

        let response = await newgetLinkedMsisdns(this.state.selectedJob.id);

        // console.log(response);

        let msisdn1 = this.state.selectedJob.query;
        let msisdn2 = this.state.selectedJob.query1;
        let party1cdrs = [];
        let party2cdrs = [];

        let tabledata = response.results.map((ele, index) => {
          if (index === 0)
            return {
              msisdn1,
              msisdn2,
              commonmsisdn: ele.number,
              linkId: ele.linkId,
              // party1CDRs: JSON.parse(ele.party1CDRs), //parse , as data is in string format
              // party2CDRs: JSON.parse(ele.party2CDRs),
            };
          else {
            return {
              commonmsisdn: ele.number,
              linkId: ele.linkId,

              // party1CDRs: JSON.parse(ele.party1CDRs),
              // party2CDRs: JSON.parse(ele.party2CDRs),
            };
          }
        });
        // console.log("Table Data", tabledata);

        // tabledata.forEach((ele) => {
        //   party1cdrs.push(ele.party1CDRs);
        //   party2cdrs.push(ele.party2CDRs);
        // });

        // //store cdr records for a number in bucket
        // let bucket_party1 = [];
        // let bucket_party2 = [];

        // party1cdrs.map((ele) => {
        //   bucket_party1.push(Object.values(ele).flat());
        // });
        // party2cdrs.map((ele) => {
        //   bucket_party2.push(Object.values(ele).flat());
        // });

        this.setState({
          data: tabledata,
          key: this.state.key + 1,
          loaderStatus: false,
          // party1cdrs: bucket_party1,
          // party2cdrs: bucket_party2,
        });
      }
    } catch (error) {
      console.log({ ...error });
      console.log("Error", error.message);
      this.setState({ loaderStatus: false });
    }
  }

  async getCellIdLinkedData() {
    try {
      if (this.state.selectedJob.query1 && this.state.selectedJob.query2) {
        this.setState({
          loaderStatus: true,
        });

        let response = await newgetLinkedMsisdns(this.state.selectedJob.id);

        // let response = await getUsingCellId(
        //     this.state.selectedJob.query1,
        //     this.state.selectedJob.query2,
        //     this.state.selectedJob.startTime,
        //     this.state.selectedJob.endTime
        // );
        // console.log("Response : ");
        // console.log(response);

        // let newData = this.state.data;
        // console.log(newData);
        // if (!newData[this.state.searchMsisdn])
        //   newData[this.state.searchMsisdn] = response;

        let msisdn1 = ["Long/Lat and Radius: "],
          msisdn2 = ["Long/Lat and Radius: "];

        msisdn1.push(this.state.selectedJob.query1);

        msisdn2.push(this.state.selectedJob.query2);

        let party1cdrs = [];
        let party2cdrs = [];

        let tabledata = response.results.map((ele, index) => {
          if (index === 0)
            return {
              msisdn1,
              msisdn2,
              commonmsisdn: ele.number,
              linkId: ele.linkId,
              // party1CDRs: JSON.parse(ele.party1CDRs), //parse , as data is in string format
              // party2CDRs: JSON.parse(ele.party2CDRs),
            };
          else {
            return {
              commonmsisdn: ele.number,
              linkId: ele.linkId,

              // party1CDRs: JSON.parse(ele.party1CDRs),
              // party2CDRs: JSON.parse(ele.party2CDRs),
            };
          }
        });
        // console.log("Table Data", tabledata);

        // tabledata.forEach((ele) => {
        //   party1cdrs.push(ele.party1CDRs);
        //   party2cdrs.push(ele.party2CDRs);
        // });

        // //store cdr records for a number in bucket
        // let bucket_party1 = [];
        // let bucket_party2 = [];

        // party1cdrs.map((ele) => {
        //   bucket_party1.push(Object.values(ele).flat());
        // });
        // party2cdrs.map((ele) => {
        //   bucket_party2.push(Object.values(ele).flat());
        // });

        this.setState({
          data: tabledata,
          key: this.state.key + 1,
          loaderStatus: false,
          // party1cdrs: bucket_party1,
          // party2cdrs: bucket_party2,
        });
      }
    } catch (error) {
      console.log({ ...error });
      console.log("Error", error.message);
      this.setState({ loaderStatus: false });
    }
  }
}
