/* eslint-disable no-unused-vars */
/* eslint-disable react/no-direct-mutation-state */
import {
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  AppBar,
  Toolbar,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  withStyles,
  Slide,
} from "@material-ui/core";
import {
  Add,
  AddBox,
  Close,
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
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import VisibilityIcon from "@material-ui/icons/Visibility";
import RefreshIcon from "@material-ui/icons/Refresh";
import EditIcon from "@material-ui/icons/Edit";
import { Autocomplete } from "@material-ui/lab";
import MaterialTable from "material-table";
import LuxonUtils from "@date-io/luxon";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import React, { forwardRef } from "react";
import CloseIcon from "@material-ui/icons/Close";
import MapBoxMapsMarker from "../../CaseOT/Zones/MapBoxMapsMarker";

// Local
import {
  drawerWidth,
  DEFAULT_CASE_CHECK_OT,
  FONT_SIZE,
  HEADER_FONT_SIZE,
} from "../../../config";
import AlertCard from "../../../components/alert-card/alert-card.component";
import MapContainer from "../../CaseOT/Map.js";
import {
  addJob,
  getAllCases,
  getJobs,
  editJob,
  deleteJob,
  getUsers,
  getCellSites,
} from "../../../util/network";
import { Pointer } from "highcharts";
import Reports from "../Reports";

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
  chip: {
    margin: theme.spacing(0.5),
    fontSize: FONT_SIZE,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    fontSize: FONT_SIZE,
  },
  drawerPaper: {
    width: "40%",
    align: "center",
    fontSize: FONT_SIZE,
  },
  drawercontent: {
    padding: 16,
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

class CaseIntelAuto extends React.Component {
  constructor(props) {
    super(props);
    this.getDrawer = this.getDrawer.bind(this);
    this.getCaseMetadataComponent = this.getCaseMetadataComponent.bind(this);
    this.getJobsTableComponent = this.getJobsTableComponent.bind(this);
    this.fetchAllCases = this.fetchAllCases.bind(this);
    this.resetToDefault = this.resetToDefault.bind(this);
    // this.getAllAccounts = this.getAllAccounts.bind(this);
    this.fetchJobsForCase = this.fetchJobsForCase.bind(this);
    this.onCreateJobButtonPress = this.onCreateJobButtonPress.bind(this);
    this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.onTowerSelect = this.onTowerSelect.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  state = {
    showReportOnClick: null,
    data: {},
    id: -1,
    activeTab: "",
    mapKey: 1,
    currentAccount: this.props.currentAccount,
    editMode: false,
    drawerOpen: false,
    selectedCase: this.props.selectedCase,
    accountIdNameLookupMap: {},
    userIdNameLookupMap: {},
    selectedCaseJobsList: [],
    width: "96%",
    margin: 8,
    selectedCellChoice: null,
    selectedJob: null,
    newJob: {
      id: -1,
      case: -1,
      createdBy: this.props.currentAccount["user"],
      category: "IMSI",
      type: "Single Target",
      number: "0",
      num: "0",
      status: "",
      latitude: -1,
      longitude: -1,
      distance: -1,
      lac: -1,
      cellId: -1,
      cellId1: -1,
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(
        0,
        0,
        1,
        0
      ),
      endTime: new Date().setHours(24, 0, -1, -1).valueOf(),
      query: "234",
      query1: "234",
      query2: "0",
      radius: "0",
    },
    editableItem: {
      name: "",
      description: "",
      lat1: "",
      lng1: "",
      lat2: "",
      lng2: "",
      cases: [],
      area: 0,
    },
    markers: [
      {
        name: "Current position",
        position: {
          lat: 9.58817943397567,
          lng: 8.016038970947266,
        },
      },
    ],
    mapPosition: {
      lat: 9.58817943397567,
      lng: 8.016038970947266,
    },
  };

  onPlaceSelected = (place) => {
    let lat = place.geometry.location.lat(),
      lng = place.geometry.location.lng();

    this.setState((prevState) => {
      const markers = [...this.state.markers];
      this.state.mapPosition.lat = lat;
      this.state.mapPosition.lng = lng;
      let index = markers.length - 1;
      markers[index] = { ...markers[index], position: { lat, lng } };
      return { markers };
    });
  };
  onMarkerDragEnd = (coord, index) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    this.setState((prevState) => {
      const markers = [...this.state.markers];
      markers[index] = { ...markers[index], position: { lat, lng } };
      return { markers };
    });

    this.setState({
      newJob: {
        ...this.state.newJob,
        latitude: lat,
        longitude: lng,
      },
    });
  };

  onClose() {
    this.setState({
      alertOpen: false,
    });
  }

  onClickEdit(rowData) {
    console.log("rowData", rowData);
    let query = rowData.query;
    let latitude = rowData.category === "Location" ? query.split(",")[0] : -1,
      longitude = rowData.category === "Location" ? query.split(",")[1] : -1,
      distance = rowData.category === "Location" ? query.split(",")[2] : -1;

    let cellId =
      rowData.type === "CellID Linked" ? rowData.query1.split(",")[0] : -1;
    let cellId1 =
      rowData.type === "CellID Linked" ? rowData.query2.split(",")[0] : -1;
    distance =
      rowData.type === "CellID Linked" ? rowData.query1.split(",")[1] : -1;

    let queryString =
      rowData.category === "IMSI"
        ? "IMSI:" + query
        : rowData.category === "MSISDN"
        ? "MSIS:" + query
        : rowData.category === "IMEI"
        ? "IMEI:" + query
        : query;

    this.setState(
      {
        editMode: true,
        mapKey: this.state.mapKey + 1,
        mapPosition: {
          lat: latitude,
          lng: longitude,
        },
        newJob: {
          id: rowData.id,
          case: rowData.case,
          createdBy: rowData.createdBy,
          name: rowData.name,
          category: rowData.category,
          type: rowData.type,
          number: rowData.number,
          num: rowData.num,
          status: rowData.status,
          latitude: latitude,
          longitude: longitude,
          distance: distance,
          lac: -1,
          cellId: cellId,
          cellId1: cellId1,
          startTime: rowData.startTime,
          endTime: rowData.endTime,
          query: rowData.query,
          query1: rowData.query1,
          query2: rowData.query2,
          radius: rowData.radius,
        },
      },
      () => {
        this.setState({
          drawerOpen: !this.state.drawerOpen,
        });
      }
    );
  }

  changePage = (rowData) => {
    this.setState({ showReportOnClick: true });
    this.setState({ data: rowData });
    this.setState({ width: "100%" });
    this.setState({ margin: 0 });
    this.setState({ activeTab: "Reports" });
    this.setState({ selectedJob: rowData });
  };

  changeTab(tabName) {
    this.setState({ activeTab: tabName });
  }

  render() {
    return (
      <div>
        {this.state.alertOpen && (
          <AlertCard
            onClose={this.onClose}
            type={this.state.alertType}
            title={this.state.alertTitle}
            message={this.state.alertMessage}
          />
        )}
        {this.state.selectedCase && this.getDrawer()}

        {this.state.selectedCase ? (
          this.state.activeTab === "Reports" ? (
            <Reports
              currentAccount={this.state.currentAccount}
              data={this.state.selectedJob}
              selectedCase={this.state.selectedCase}
              changeTab={this.changeTab}
            />
          ) : (
            <Grid container>
              <Grid
                item
                style={{
                  textAlign: "center",
                  width: "4%",
                  minHeight: window.innerHeight,
                  backgroundColor: "#18202c",
                  marginRight: "3%",
                  cursor: "pointer",
                }}
                onClick={() =>
                  this.setState({
                    drawerOpen: true,
                    editMode: false,
                  })
                }
              >
                <span style={{ fontSize: 21, color: "white" }}>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  A<br />
                  D<br />
                  D<br />
                  <br />
                  J<br />
                  O<br />
                  B<br />
                </span>
              </Grid>
              <Grid item md={11}>
                {this.getCaseMetadataComponent()}

                {this.getJobsTableComponent()}
              </Grid>
            </Grid>
          )
        ) : (
          <div />
        )}
      </div>
    );
  }

  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  getDrawer() {
    const { classes } = this.props;

    const handleChange = (event) => {
      this.setState({
        newJob: { ...this.state.newJob, name: event.target.value },
      });
    };
    let nam = this.state.newJob.name;
    let regexp = "^[a-zA-Z][a-zA-Z0-9. -]$";
    const error = nam?.length < 6;
    const goThrough = () => {
      if (nam?.length >= 6) {
        this.onCreateJobButtonPress();
      } else {
        alert("Name should be a minimum of 6 characters");
      }
    };
    return (
      <Dialog
        fullScreen
        aria-labelledby="customized-dialog-title"
        //classes={{ paper: classes.drawerPaper}}
        open={this.state.drawerOpen}
        onClose={() => this.resetToDefault()}
        TransitionComponent={this.Transition}
        style={{ zIndex: 12 }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => this.resetToDefault()}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {this.state.editMode ? "Edit Job" : "Add Job"}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.drawercontent}>
          <FormControl style={{ marginTop: 32, minWidth: "100%" }}>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              className={classes.field}
              fullWidth
              value={this.state.newJob.type}
              onChange={(event) => {
                // if (event.target.value === "Single Target") {
                //   this.setState({
                //     newJob: {
                //       ...this.state.newJob,
                //       type: event.target.value,
                //     },
                //   });
                // } else {
                this.setState({
                  newJob: {
                    ...this.state.newJob,
                    category:
                      event.target.value === "Single Target"
                        ? "IMSI"
                        : event.target.value === "MSISDN Linked"
                        ? "MSISDN"
                        : "LAC/Cell-ID",
                    type: event.target.value,
                  },
                });
                // }
              }}
            >
              <MenuItem value={"Single Target"} className={classes.field}>
                Single Target
              </MenuItem>
              <MenuItem value={"MSISDN Linked"} className={classes.field}>
                MSISDN Linked
              </MenuItem>
              <MenuItem value={"CellID Linked"} className={classes.field}>
                CellID Linked
              </MenuItem>
            </Select>
          </FormControl>
          {this.state.newJob.type !== "CellID Linked" &&
            this.state.newJob.type !== "MSISDN Linked" && (
              <FormControl style={{ marginTop: 32, minWidth: "100%" }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  className={classes.field}
                  fullWidth
                  value={this.state.newJob.category}
                  onChange={(event) => {
                    if (event.target.value === "Location") {
                      this.setState({
                        newJob: {
                          ...this.state.newJob,
                          category: event.target.value,
                          latitude: this.state.markers[0].position.lat,
                          longitude: this.state.markers[0].position.lng,
                        },
                      });
                    } else {
                      this.setState({
                        newJob: {
                          ...this.state.newJob,
                          category: event.target.value,
                          latitude: -1,
                          longitude: -1,
                        },
                      });
                    }
                  }}
                >
                  <MenuItem value={"IMSI"} className={classes.field}>
                    IMSI
                  </MenuItem>
                  <MenuItem value={"IMEI"} className={classes.field}>
                    IMEI
                  </MenuItem>
                  <MenuItem value={"MSISDN"} className={classes.field}>
                    MSISDN
                  </MenuItem>
                  <MenuItem value={"Location"} className={classes.field}>
                    Location
                  </MenuItem>
                  {/* <MenuItem value={"LAC/Cell-ID"} className={classes.field}>
                    LAC/Cell-ID
                  </MenuItem> */}
                </Select>
              </FormControl>
            )}
          {this.state.newJob.type === "CellID Linked" && (
            <FormControl style={{ marginTop: 32, minWidth: "100%" }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                className={classes.field}
                fullWidth
                value={this.state.newJob.category}
                onChange={(event) => {
                  if (event.target.value === "LAC/Cell-ID") {
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        category: event.target.value,
                        latitude: this.state.markers[0].position.lat,
                        longitude: this.state.markers[0].position.lng,
                      },
                    });
                  } else {
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        category: event.target.value,
                        latitude: -1,
                        longitude: -1,
                      },
                    });
                  }
                }}
              >
                <MenuItem value={"LAC/Cell-ID"} className={classes.field}>
                  LAC/Cell-ID
                </MenuItem>
              </Select>
            </FormControl>
          )}
          {this.state.newJob.type === "MSISDN Linked" && (
            <FormControl style={{ marginTop: 32, minWidth: "100%" }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                className={classes.field}
                fullWidth
                value={this.state.newJob.category}
                onChange={(event) => {
                  if (event.target.value === "MSISDN") {
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        category: event.target.value,
                        latitude: this.state.markers[0].position.lat,
                        longitude: this.state.markers[0].position.lng,
                      },
                    });
                  } else {
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        category: event.target.value,
                        latitude: -1,
                        longitude: -1,
                      },
                    });
                  }
                }}
              >
                <MenuItem value={"MSISDN"} className={classes.field}>
                  MSISDN
                </MenuItem>
              </Select>
            </FormControl>
          )}
          <TextField
            required
            InputProps={{
              classes: {
                input: classes.field,
              },
            }}
            InputLabelProps={{
              classes: {
                input: classes.field,
              },
              shrink: true,
            }}
            style={{ marginTop: 32, minWidth: "100%" }}
            label="Name"
            onChange={handleChange}
            margin="normal"
            helperText={
              error
                ? "Name needs to start from a letter and should be minimum 6 characters long"
                : ""
            }
            error={error}
            value={this.state.newJob.name}
          />
          <MuiPickersUtilsProvider utils={LuxonUtils}>
            <KeyboardDateTimePicker
              style={{ marginTop: 32, minWidth: "100%" }}
              InputProps={{
                classes: {
                  input: classes.field,
                },
              }}
              InputLabelProps={{
                classes: {
                  input: classes.field,
                },
              }}
              // disableToolbar
              autoOk={true}
              // variant="inline"
              margin="normal"
              format="dd/MM/yyyy HH:mm:ss"
              ampm={false}
              // openTo="year"
              Date={new Date(this.state.newJob.endTime)}
              label="Target Start DateTime"
              value={new Date(this.state.newJob.startTime)}
              onChange={(newDate) => {
                this.setState({
                  newJob: {
                    ...this.state.newJob,
                    startTime: newDate.valueOf(),
                  },
                });
              }}
            />
          </MuiPickersUtilsProvider>

          <MuiPickersUtilsProvider utils={LuxonUtils}>
            <KeyboardDateTimePicker
              style={{ marginTop: 32, minWidth: "100%" }}
              InputProps={{
                classes: {
                  input: classes.field,
                },
              }}
              InputLabelProps={{
                classes: {
                  input: classes.field,
                },
              }}
              // disableToolbar
              autoOk={true}
              // variant="inline"
              margin="normal"
              // openTo="year"
              format="dd/MM/yyyy HH:mm:ss"
              ampm={false}
              minDate={new Date(this.state.newJob.startTime)}
              label="Target End DateTime"
              value={new Date(this.state.newJob.endTime)}
              onChange={(newDate) => {
                // const dateTimeData = newDate.c;
                // const endDate = new Date(
                //   dateTimeData.year,
                //   dateTimeData.month - 1,
                //   dateTimeData.day,
                //   dateTimeData.hour,
                //   dateTimeData.minute,
                //   dateTimeData.second
                // );
                this.setState({
                  newJob: {
                    ...this.state.newJob,
                    endTime: newDate.valueOf(),
                  },
                });
              }}
            />
          </MuiPickersUtilsProvider>

          {this.state.newJob.type === "MSISDN Linked" && (
            <FormControl style={{ marginTop: 32, minWidth: "100%" }}>
              <InputLabel id="number-label">Number of Days</InputLabel>
              <Select
                labelId="number-label"
                className={classes.field}
                fullWidth
                defaultValue={"0"}
                value={this.state.newJob.number}
                onChange={(event) => {
                  if (event.target.value === "0") {
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        number: event.target.value,
                      },
                    });
                  } else {
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        number: event.target.value,
                      },
                    });
                  }
                }}
              >
                {" "}
                <MenuItem value={"0"} className={classes.field}>
                  0
                </MenuItem>
                <MenuItem value={"1"} className={classes.field}>
                  1
                </MenuItem>
                <MenuItem value={"2"} className={classes.field}>
                  2
                </MenuItem>
                <MenuItem value={"3"} className={classes.field}>
                  3
                </MenuItem>
                <MenuItem value={"4"} className={classes.field}>
                  4
                </MenuItem>
                <MenuItem value={"5"} className={classes.field}>
                  5
                </MenuItem>
                <MenuItem value={"6"} className={classes.field}>
                  6
                </MenuItem>
                <MenuItem value={"7"} className={classes.field}>
                  7
                </MenuItem>
                <MenuItem value={"8"} className={classes.field}>
                  8
                </MenuItem>
                <MenuItem value={"9"} className={classes.field}>
                  9
                </MenuItem>
                <MenuItem value={"10"} className={classes.field}>
                  10
                </MenuItem>
                <MenuItem value={"11"} className={classes.field}>
                  11
                </MenuItem>
                <MenuItem value={"12"} className={classes.field}>
                  12
                </MenuItem>
                <MenuItem value={"13"} className={classes.field}>
                  13
                </MenuItem>
                <MenuItem value={"14"} className={classes.field}>
                  14
                </MenuItem>
                <MenuItem value={"15"} className={classes.field}>
                  15
                </MenuItem>
                <MenuItem value={"16"} className={classes.field}>
                  16
                </MenuItem>
                <MenuItem value={"17"} className={classes.field}>
                  17
                </MenuItem>
                <MenuItem value={"18"} className={classes.field}>
                  18
                </MenuItem>
                <MenuItem value={"19"} className={classes.field}>
                  19
                </MenuItem>
                <MenuItem value={"20"} className={classes.field}>
                  20
                </MenuItem>
                <MenuItem value={"21"} className={classes.field}>
                  21
                </MenuItem>
                <MenuItem value={"22"} className={classes.field}>
                  22
                </MenuItem>
                <MenuItem value={"23"} className={classes.field}>
                  23
                </MenuItem>
                <MenuItem value={"24"} className={classes.field}>
                  24
                </MenuItem>
                <MenuItem value={"25"} className={classes.field}>
                  25
                </MenuItem>
                <MenuItem value={"26"} className={classes.field}>
                  26
                </MenuItem>
                <MenuItem value={"27"} className={classes.field}>
                  27
                </MenuItem>
                <MenuItem value={"28"} className={classes.field}>
                  28
                </MenuItem>
                <MenuItem value={"29"} className={classes.field}>
                  29
                </MenuItem>
                <MenuItem value={"30"} className={classes.field}>
                  30
                </MenuItem>
                <MenuItem value={"31"} className={classes.field}>
                  31
                </MenuItem>
              </Select>
            </FormControl>
          )}
          {this.state.newJob.type === "CellID Linked" && (
            <FormControl style={{ marginTop: 32, minWidth: "100%" }}>
              <InputLabel id="num-label">Number of Hours</InputLabel>
              <Select
                labelId="num-label"
                className={classes.field}
                fullWidth
                defaultValue={"0"}
                value={this.state.newJob.num}
                onChange={(event) => {
                  if (event.target.value === "0") {
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        num: event.target.value,
                      },
                    });
                  } else {
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        num: event.target.value,
                      },
                    });
                  }
                }}
              >
                {" "}
                <MenuItem value={"0"} className={classes.field}>
                  0
                </MenuItem>
                <MenuItem value={"1"} className={classes.field}>
                  1
                </MenuItem>
                <MenuItem value={"2"} className={classes.field}>
                  2
                </MenuItem>
                <MenuItem value={"3"} className={classes.field}>
                  3
                </MenuItem>
                <MenuItem value={"4"} className={classes.field}>
                  4
                </MenuItem>
                <MenuItem value={"5"} className={classes.field}>
                  5
                </MenuItem>
                <MenuItem value={"6"} className={classes.field}>
                  6
                </MenuItem>
                <MenuItem value={"7"} className={classes.field}>
                  7
                </MenuItem>
                <MenuItem value={"8"} className={classes.field}>
                  8
                </MenuItem>
                <MenuItem value={"9"} className={classes.field}>
                  9
                </MenuItem>
                <MenuItem value={"10"} className={classes.field}>
                  10
                </MenuItem>
                <MenuItem value={"11"} className={classes.field}>
                  11
                </MenuItem>
                <MenuItem value={"12"} className={classes.field}>
                  12
                </MenuItem>
                <MenuItem value={"13"} className={classes.field}>
                  13
                </MenuItem>
                <MenuItem value={"14"} className={classes.field}>
                  14
                </MenuItem>
                <MenuItem value={"15"} className={classes.field}>
                  15
                </MenuItem>
                <MenuItem value={"16"} className={classes.field}>
                  16
                </MenuItem>
                <MenuItem value={"17"} className={classes.field}>
                  17
                </MenuItem>
                <MenuItem value={"18"} className={classes.field}>
                  18
                </MenuItem>
                <MenuItem value={"19"} className={classes.field}>
                  19
                </MenuItem>
                <MenuItem value={"20"} className={classes.field}>
                  20
                </MenuItem>
                <MenuItem value={"21"} className={classes.field}>
                  21
                </MenuItem>
                <MenuItem value={"22"} className={classes.field}>
                  22
                </MenuItem>
                <MenuItem value={"23"} className={classes.field}>
                  23
                </MenuItem>
                <MenuItem value={"24"} className={classes.field}>
                  24
                </MenuItem>
              </Select>
            </FormControl>
          )}

          {this.state.newJob.category === "Location" && (
            <TextField
              style={{ marginTop: 32, minWidth: "100%" }}
              InputProps={{
                classes: {
                  input: classes.field,
                },
              }}
              InputLabelProps={{
                classes: {
                  input: classes.field,
                },
                shrink: true,
              }}
              label="Target Location (Latitude)"
              type="number"
              defaultValue={
                this.state.newJob.latitude === -1
                  ? this.state.markers[0].position.lat
                  : this.state.newJob.latitude
              }
              value={
                this.state.newJob.latitude === -1
                  ? this.state.markers[0].position.lat
                  : this.state.newJob.latitude
              }
              onChange={(event) =>
                this.setState({
                  newJob: {
                    ...this.state.newJob,
                    latitude: event.target.value,
                  },
                })
              }
            />
          )}

          {this.state.newJob.category === "Location" && (
            <TextField
              style={{ marginTop: 32, minWidth: "100%" }}
              InputProps={{
                classes: {
                  input: classes.field,
                },
              }}
              InputLabelProps={{
                classes: {
                  input: classes.field,
                },
                shrink: true,
              }}
              label="Target Location (Longitude)"
              type="number"
              defaultValue={
                this.state.newJob.longitude === -1
                  ? this.state.markers[0].position.lng
                  : this.state.newJob.longitude
              }
              value={
                this.state.newJob.longitude === -1
                  ? this.state.markers[0].position.lng
                  : this.state.newJob.longitude
              }
              onChange={(event) =>
                this.setState({
                  newJob: {
                    ...this.state.newJob,
                    longitude: event.target.value,
                  },
                })
              }
            />
          )}

          {/* {this.state.newJob.category === "LAC/Cell-ID" && (
            <TextField
              style={{ marginTop: 32, minWidth: "100%" }}
              InputProps={{
                classes: {
                  input: classes.field,
                },
              }}
              InputLabelProps={{
                classes: {
                  input: classes.field,
                },
                shrink: true,
              }}
              label="Target LAC"
              type="number"
              value={this.state.newJob.lac === -1 ? "" : this.state.newJob.lac}
              onChange={(event) =>
                this.setState({
                  newJob: { ...this.state.newJob, lac: event.target.value },
                })
              }
            />
          )} */}

          {this.state.newJob.category === "LAC/Cell-ID" && (
            <>
              <TextField
                style={{ marginTop: 32, minWidth: "100%" }}
                id="cellid"
                onClick={() => {
                  this.setState({
                    selectedCellChoice: 0,
                  });
                  document.getElementById("mapmarkercontainer").focus();
                }}
                InputProps={{
                  classes: {
                    input: classes.field,
                  },
                }}
                InputLabelProps={{
                  classes: {
                    input: classes.field,
                  },
                  shrink: true,
                }}
                label="Target Location 1"
                type="text"
                value={
                  this.state.newJob.cellId === -1
                    ? ""
                    : this.state.newJob.cellId
                }
                onChange={(event) =>
                  this.setState({
                    newJob: {
                      ...this.state.newJob,
                      cellId: event.target.value,
                    },
                  })
                }
              />
              <TextField
                style={{ marginTop: 32, minWidth: "100%" }}
                id="cellid1"
                onClick={() => {
                  this.setState({
                    selectedCellChoice: 1,
                  });
                  document.getElementById("mapmarkercontainer").focus();
                }}
                InputProps={{
                  classes: {
                    input: classes.field,
                  },
                }}
                InputLabelProps={{
                  classes: {
                    input: classes.field,
                  },
                  shrink: true,
                }}
                label="Target Location 2"
                type="text"
                value={
                  this.state.newJob.cellId1 === -1
                    ? ""
                    : this.state.newJob.cellId1
                }
                onChange={(event) =>
                  this.setState({
                    newJob: {
                      ...this.state.newJob,
                      cellId1: event.target.value,
                    },
                  })
                }
              />
            </>
          )}
          {/* {this.state.newJob.category === "LAC/Cell-ID" && (
            <FormControl style={{ marginTop: 32, minWidth: "100%" }}>
              <InputLabel id="radius-label">
                Include Neighboring Cell-IDs (Radius)
              </InputLabel>
              <Select
                labelId="radius-label"
                className={classes.field}
                fullWidth
                defaultValue={"0"}
                value={this.state.newJob.radius}
                onChange={(event) => {
                  if (event.target.value === "0") {
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        radius: event.target.value,
                      },
                    });
                  } else {
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        radius: event.target.value,
                      },
                    });
                  }
                }}
              >
                {" "}
                <MenuItem value={"0"} className={classes.field}>
                  0
                </MenuItem>
                <MenuItem value={"250"} className={classes.field}>
                  250
                </MenuItem>
                <MenuItem value={"500"} className={classes.field}>
                  500
                </MenuItem>
                <MenuItem value={"1000"} className={classes.field}>
                  1000
                </MenuItem>
              </Select>
            </FormControl>
          )} */}
          {(this.state.newJob.category === "Location" ||
            this.state.newJob.category === "LAC/Cell-ID") && (
            <div>
              <TextField
                style={{ marginTop: 32, minWidth: "100%", marginBottom: 12 }}
                InputProps={{
                  classes: {
                    input: classes.field,
                  },
                }}
                InputLabelProps={{
                  classes: {
                    input: classes.field,
                  },
                  shrink: true,
                }}
                label="Target Distance(in mts)"
                type="number"
                value={
                  this.state.newJob.distance === -1
                    ? ""
                    : this.state.newJob.distance
                }
                onChange={(event) =>
                  this.setState({
                    newJob: {
                      ...this.state.newJob,
                      distance: event.target.value,
                    },
                  })
                }
              />
            </div>
          )}

          {(this.state.newJob.category === "IMSI" ||
            this.state.newJob.category === "IMEI" ||
            this.state.newJob.category === "MSISDN") && (
            <TextField
              style={{ marginTop: 32, minWidth: "100%" }}
              InputProps={{
                classes: {
                  input: classes.field,
                },
              }}
              InputLabelProps={{
                classes: {
                  input: classes.field,
                },
                shrink: true,
              }}
              label="Target"
              value={this.state.newJob.query}
              onChange={(event) =>
                this.setState({
                  newJob: { ...this.state.newJob, query: event.target.value },
                })
              }
            />
          )}
          {this.state.newJob.type === "MSISDN Linked" &&
            this.state.newJob.type !== "CellID Linked" && (
              <TextField
                style={{ marginTop: 32, minWidth: "100%" }}
                InputProps={{
                  classes: {
                    input: classes.field,
                  },
                }}
                InputLabelProps={{
                  classes: {
                    input: classes.field,
                  },
                  shrink: true,
                }}
                label="Target 2"
                defaultValue={0}
                value={this.state.newJob.query1}
                onChange={(event) =>
                  this.setState({
                    newJob: {
                      ...this.state.newJob,
                      query1: event.target.value,
                    },
                  })
                }
              />
            )}

          {this.state.newJob.category === "Location" && (
            <MapContainer
              key={this.state.mapKey}
              width={"97%"}
              mapPosition={this.state.mapPosition}
              markers={this.state.markers}
              onMarkerDragEnd={this.onMarkerDragEnd}
              onPlaceSelected={this.onPlaceSelected}
            />
          )}
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 8 }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={goThrough}
          >
            {this.state.editMode ? "Edit" : "Create Job"}
          </Button>
        </div>
        <div>
          <br />
        </div>
        <div>
          {this.state.newJob.category === "LAC/Cell-ID" && (
            <div>
              <strong> Select the Cell ID</strong>
              <Grid container>
                <Grid item md={9} id="mapmarkercontainer">
                  {/* <MapBoxMaps updateCoordinates={this.updateCoordinates} /> */}
                  {(this.state.selectedCellChoice === 0 ||
                    this.state.selectedCellChoice === 1) && (
                    <MapBoxMapsMarker
                      getCellSites={getCellSites}
                      selectTower={this.onTowerSelect}
                    />
                  )}
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      </Dialog>
    );
  }

  onTowerSelect({ latitude, longitude, cellsite }) {
    console.log(latitude, longitude, cellsite);
    if (this.state.selectedCellChoice === 0) {
      document.getElementById("cellid").focus();
      this.setState({
        newJob: {
          ...this.state.newJob,
          cellId: `${latitude},${longitude}`,
          selectedCellChoice: null,
        },
      });
    } else if (this.state.selectedCellChoice === 1) {
      document.getElementById("cellid1").focus();
      this.setState({
        newJob: {
          ...this.state.newJob,
          cellId1: `${latitude},${longitude}`,
          selectedCellChoice: null,
        },
      });
    }
  }

  getCaseMetadataComponent() {
    const { classes } = this.props;

    return (
      <>
        <Accordion
          elevation={4}
          style={{ marginTop: 32, marginRight: 16, fontSize: FONT_SIZE }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              component="h2"
              variant="h2"
              style={{ marginBottom: 24 }}
            >
              Case <b>ID: </b>
              {this.state.selectedCase ? this.state.selectedCase.id : ""}{" "}
              <b>Name: </b>
              {this.state.selectedCase ? this.state.selectedCase.name : ""}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <b>ID: </b>
            {this.state.selectedCase ? this.state.selectedCase.id : ""}
          </AccordionDetails>
          <AccordionDetails>
            <b>Name: </b>
            {this.state.selectedCase ? this.state.selectedCase.name : ""}
          </AccordionDetails>
          <AccordionDetails>
            <b>Description: </b>
            {this.state.selectedCase ? this.state.selectedCase.description : ""}
          </AccordionDetails>
          <AccordionDetails>
            <b>Category: </b>
            {this.state.selectedCase ? this.state.selectedCase.category : ""}
          </AccordionDetails>
          <AccordionDetails>
            <b>Status: </b>
            {this.state.selectedCase ? (
              <span
                style={{
                  color:
                    this.state.selectedCase.status === "Open" ? "green" : "red",
                }}
              >
                {this.state.selectedCase.status}
              </span>
            ) : (
              ""
            )}
          </AccordionDetails>
          <AccordionDetails>
            <div style={{ marginTop: 16 }} />

            <b>Users: </b>
            {this.state.selectedCase
              ? this.state.selectedCase.accounts.map((accountName, index) => (
                  <Chip
                    key={index}
                    label={accountName}
                    className={classes.chip}
                  />
                ))
              : ""}
            <br />
          </AccordionDetails>
          {/* <AccordionDetails>
            <b>Targets: </b>
            {this.state.selectedCase
              ? this.state.selectedCase.targets.map((target, index) => (
                  <Chip
                    key={index}
                    label={target.substring(5, target.length)}
                    className={classes.chip}
                  />
                ))
              : ""}
            <br />
          </AccordionDetails> */}
        </Accordion>

        {/* <Card
          elevation={4}
          style={{ marginTop: 32, marginRight: 16, fontSize: FONT_SIZE }}
        >
          <CardContent>
            <Typography
              component="h2"
              variant="h2"
              style={{ marginBottom: 24 }}
            >
              Case Summary
            </Typography>

            <b>ID: </b>
            {this.state.selectedCase ? this.state.selectedCase.id : ""}
            <br />

            <b>Name: </b>
            {this.state.selectedCase ? this.state.selectedCase.name : ""}
            <br />

            <b>Description: </b>
            {this.state.selectedCase ? this.state.selectedCase.description : ""}
            <br />

            <b>Category: </b>
            {this.state.selectedCase ? this.state.selectedCase.category : ""}
            <br />

            <b>Status: </b>
            {this.state.selectedCase ? (
              <span
                style={{
                  color:
                    this.state.selectedCase.status === "Open" ? "green" : "red",
                }}
              >
                {this.state.selectedCase.status}
              </span>
            ) : (
              ""
            )}
            <br />

            <div style={{ marginTop: 16 }} />

            <b>Users: </b>
            {this.state.selectedCase
              ? this.state.selectedCase.accounts.map((accountId, index) => (
                  <Chip
                    key={index}
                    label={this.state.accountIdNameLookupMap[accountId]}
                    className={classes.chip}
                  />
                ))
              : ""}
            <br />

            <b>Targets: </b>
            {this.state.selectedCase
              ? this.state.selectedCase.targets.map((target, index) => (
                  <Chip
                    key={index}
                    label={target.substring(5, target.length)}
                    className={classes.chip}
                  />
                ))
              : ""}
            <br />
          </CardContent>
        </Card> */}
      </>
    );
  }

  getJobsTableComponent() {
    return (
      <MaterialTable
        icons={tableIcons}
        style={{ marginTop: 32, marginRight: 16, marginBottom: 32 }}
        components={{
          Container: (props) => <Paper {...props} elevation={4} />,
        }}
        options={{
          grouping: false,
          exportButton: this.state.currentAccount.modules.caseot.export,
          exportAllData: this.state.currentAccount.modules.caseot.export,
          paging: true,
          pageSize: 10,
          actionsColumnIndex: -1,
          rowStyle: {
            fontSize: FONT_SIZE,
          },
          headerStyle: {
            fontSize: HEADER_FONT_SIZE,
          },
        }}
        columns={[
          {
            title: "Sr No",
            field: "tableData.id",
            render: (rowData) => {
              return <span>{rowData.tableData.id + 1}</span>;
            },
          },
          {
            title: "ID",
            field: "id",
            type: "numeric",
            align: "left",
            width: 16,
            defaultSort: "desc",
          },
          {
            title: "View",
            render: (rowData) => {
              return (
                <div
                // onClick={(rowData) => {
                //   this.changePage(rowData);
                // }}
                >
                  <VisibilityIcon color="primary" />
                </div>
              );
            },
          },
          { title: "Name", field: "name" },
          { title: "Created By", field: "createdByName" },
          { title: "Category", field: "category" },
          { title: "Type", field: "type" },
          {
            title: "Target",
            field: "query",
            render: (rowData) => {
              let jobCategory = rowData["category"];
              let type = rowData["type"];
              let resultantHtmlElement = null;
              if (jobCategory === "Location") {
                let queryArr = rowData["query"].split(",");
                resultantHtmlElement = (
                  <span>
                    <b>Latitude: </b>
                    {queryArr[0]}
                    <br />
                    <b>Longitude: </b>
                    {queryArr[1]}
                    <br />
                    <b>Distance: </b>
                    {queryArr[2]}
                    <br />
                  </span>
                );
              } else if (jobCategory === "LAC/Cell-ID") {
                let queryArr = "";
                if (rowData["query2"] == null) {
                  queryArr = 0;
                } else {
                  queryArr = rowData["query2"].split(",");

                  resultantHtmlElement = (
                    <span>
                      <b>LAC: </b>
                      {queryArr[0]}
                      <br />
                      <b>Cell-ID 1: </b>
                      {queryArr[1]}
                      <br />
                      <b>Cell-ID 2: </b>
                      {queryArr[2]}
                      <br />
                      <b>Distance: </b>
                      {queryArr[3]}
                      <br />
                    </span>
                  );
                }
              } else if (type === "MSISDN Linked") {
                let queryArr = rowData["query"].split(",");

                resultantHtmlElement = (
                  <span>
                    <b>Target 1: </b>
                    {rowData["query"]}
                    <br />
                    <b>Target 2: </b>
                    {rowData["query1"]}
                    <br />
                  </span>
                );
              } else resultantHtmlElement = rowData["query"];
              return resultantHtmlElement;
            },
          },
          {
            title: "Status",
            field: "status",
            render: (rowData) => (
              <span
                style={{
                  color: rowData.status === "PENDING" ? "red" : "green",
                }}
              >
                {rowData.status}
              </span>
            ),
          },
          {
            title: "Start Date",
            field: "startTime",
            align: "center",
            render: (rowData) =>
              moment(rowData["startTime"]).format("DD/MM/YYYY"),
            grouping: false,
          },
          {
            title: "Start Time",
            field: "startTime",
            align: "center",
            render: (rowData) =>
              moment(rowData["startTime"]).format("HH:mm:ss"),
            grouping: false,
          },
          {
            title: "End Date",
            field: "endTime",
            align: "center",
            render: (rowData) =>
              moment(rowData["endTime"]).format("DD/MM/YYYY"),
            grouping: false,
          },
          {
            title: "End Time",
            field: "endTime",
            align: "center",
            render: (rowData) => moment(rowData["endTime"]).format("HH:mm:ss"),
            grouping: false,
          },
          {
            title: "Created On (Date)",
            field: "createdAt",
            align: "center",
            render: (rowData) =>
              moment(Date.parse(rowData["createdAt"])).format("DD/MM/YYYY"),
          },
          {
            title: "Created On (Time)",
            field: "createdAt",
            align: "center",
            render: (rowData) =>
              moment(Date.parse(rowData["createdAt"])).format("HH:mm:ss"),
          },
        ]}
        data={this.state.selectedCaseJobsList}
        title="Jobs List"
        onRowClick={(event, rowData) => {
          this.changePage(rowData);
        }}
        actions={[
          {
            icon: () => <EditIcon color="primary" />,
            tooltip: "Edit Job",
            onClick: (event, rowData) => {
              this.onClickEdit(rowData);
            },
          },
          // {
          //   icon: () => <Delete color="error" />,
          //   tooltip: "Delete Job",
          //   onClick: (event, rowData) => {
          //     // Do Delete operation
          //     this.onDeleteButtonPress(rowData);
          //   },
          // },
          {
            icon: () => <RefreshIcon color="primary" />,
            tooltip: "Refresh Table",
            isFreeAction: true,
            onClick: (event) => this.fetchJobsForCase(this.state.selectedCase),
          },
        ]}
      />
    );
  }

  componentDidMount() {
    // this.getAllAccounts();
    this.fetchAllCases();
    this.fetchJobsForCase(this.state.selectedCase);
  }
  componentDidUpdate() {
    if (this.state.alertOpen) {
      setTimeout(() => this.setState({ alertOpen: false }), 5000);
    }
  }
  resetToDefault() {
    this.setState({
      drawerOpen: false,
      editMode: false,
      newJob: {
        id: -1,
        name: null,
        case: -1,
        createdBy: this.props.currentAccount["id"],
        category: "IMSI",
        type: "Single Target",
        status: "",
        number: "0",
        num: "0",
        latitude: -1,
        longitude: -1,
        distance: -1,
        lac: -1,
        cellId: -1,
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(
          0,
          0,
          1,
          0
        ),
        endTime: new Date().setHours(24, 0, -1, -1).valueOf(),
        query: "234",
        query1: "234",
        query2: "0",
        radius: "0",
      },
      mapPosition: {
        lat: 9.58817943397567,
        lng: 8.016038970947266,
      },
    });
  }

  // async getAllAccounts() {
  //   try {
  //     let response = await getUsers();
  //     let accountIdNameLookupMap = {};

  //     response.forEach((account) => {
  //       let accountId = account["id"];
  //       let accountName = account["first_name"] + " " + account["last_name"];
  //       accountIdNameLookupMap[accountId] = accountName;
  //     });

  //     this.setState({
  //       accountIdNameLookupMap: accountIdNameLookupMap,
  //     });
  //     console.log(this.state);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async fetchAllCases() {
    try {
      let response = [];
      if (this.state.currentAccount["designation"] === "Admin") {
        response = await getAllCases();
      } else {
        response = await getAllCases(this.state.currentAccount["id"]);
      }
      response = response.filter(
        (caseItem, index) => caseItem["name"] !== DEFAULT_CASE_CHECK_OT
      );
      this.setState({ cases: response });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchJobsForCase(selectedCase) {
    try {
      this.setState({ selectedCase: selectedCase });
      let response = await getJobs(selectedCase.id);
      response.sort(function (a, b) {
        return b.id - a.id;
      });

      let users = await getUsers();
      let accountIdNameLookupMap = {};
      let userIdNameLookupMap = {};

      users.forEach((account) => {
        let accountId = account["id"];
        let userId = account["id"];
        let accountName = account["first_name"] + " " + account["last_name"];
        accountIdNameLookupMap[accountId] = accountName;
        userIdNameLookupMap[userId] = accountName;
      });

      response.forEach((caseItem, index) => {
        let createdBy = caseItem["createdBy"];
        let createdAccountName = "";
        createdAccountName = accountIdNameLookupMap[createdBy];
        if (!createdAccountName) {
          createdAccountName = this.state.userIdNameLookupMap[createdBy];
        }
        response[index]["createdByName"] = createdAccountName;
        response[index]["createdBy"] = createdBy;
      });
      console.log(this.state);
      this.setState({ selectedCaseJobsList: response });
    } catch (error) {
      console.log(error);
    }
  }

  async onCreateJobButtonPress() {
    try {
      let payload = this.state.newJob;

      if (payload.category === "Location") {
        payload["query"] =
          payload["latitude"] +
          "," +
          payload["longitude"] +
          "," +
          payload["distance"];
        delete payload["latitude"];
        delete payload["longitude"];
        delete payload["distance"];
      } else if (payload.category === "LAC/Cell-ID") {
        payload["query1"] = payload["cellId"] + "," + payload["distance"];
        payload["query2"] = payload["cellId1"] + "," + payload["distance"];
        // delete payload["cellId"];
        // delete payload["cellId1"];
        // delete payload["distance"];
      }
      payload["status"] = "PENDING";
      payload["startTime"] = payload["startTime"];
      payload["endTime"] = payload["endTime"];
      payload["type"] = payload["type"];
      payload["number"] = payload["number"];
      payload["radius"] = payload["radius"];
      payload["num"] = payload["num"];
      payload["case"] = this.state.selectedCase["id"];

      if (this.state.editMode) {
        let response = await editJob(payload.id, payload);
      } else {
        let response = await addJob(payload);
      }

      let message = this.state.editMode
        ? "Job Edited Successfully"
        : "Job Created Successfully";
      this.setState({
        alertType: "success",
        alertTitle: "Case Intel",
        alertMessage: message,
        alertOpen: true,
      });

      this.resetToDefault();
      this.fetchJobsForCase(this.state.selectedCase);
    } catch (error) {
      console.log(error);
      this.setState({
        alertType: "error",
        alertTitle: "Error",
        alertMessage: error.toString(),
        alertOpen: true,
      });
    }
  }

  async onDeleteButtonPress(rowData) {
    try {
      let response = await deleteJob(rowData.id);
      this.resetToDefault();
      this.fetchJobsForCase(this.state.selectedCase);
    } catch (error) {
      console.log(error);
    }
  }
}

export default withStyles(styles)(CaseIntelAuto);
