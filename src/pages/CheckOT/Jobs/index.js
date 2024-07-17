/* eslint-disable no-unused-vars */
/* eslint-disable react/no-direct-mutation-state */
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
  Paper,
  Select,
  TextField,
  Typography,
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
import VisibilityIcon from "@material-ui/icons/Visibility";
import moment from "moment";
import MaterialTable from "material-table";
import LuxonUtils from "@date-io/luxon";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import React, { forwardRef } from "react";
import Reports from "../Reports";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { getCellSites } from "../../../util/network";
// Local
import {
  drawerWidth,
  DEFAULT_CASE_CHECK_OT,
  FONT_SIZE,
  HEADER_FONT_SIZE,
} from "../../../config";
import MapContainer from "../../CaseOT/Map.js";
import {
  addJob,
  deleteJob,
  editJob,
  getJobs,
  getUsers,
  getAllCases,
} from "../../../util/network";
import getJobsTableComponent from "../Reports/index";
import MapBoxMaps from "../../CaseOT/Zones/MapBoxMaps";
import MapBoxMapsMarker from "../../CaseOT/Zones/MapBoxMapsMarker";
import MapBoxMapsPreview from "../../CaseOT/Zones/MapBoxMapsPreview";
import { Link, Redirect } from "react-router-dom";
import AlertCard from "../../../components/alert-card/alert-card.component";

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

class Jobs extends React.Component {
  constructor(props) {
    super(props);
    this.getDrawer = this.getDrawer.bind(this);
    this.getJobsTableComponent = this.getJobsTableComponent.bind(this);
    this.getDefaultCase = this.getDefaultCase.bind(this);
    this.resetToDefault = this.resetToDefault.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.getAllAccounts = this.getAllAccounts.bind(this);
    this.changePage = this.changePage.bind(this);
    this.getContent = this.getContent.bind(this);
    this.fetchJobsForCase = this.fetchJobsForCase.bind(this);
    this.onCreateJobButtonPress = this.onCreateJobButtonPress.bind(this);
    this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
    this.updateCoordinates = this.updateCoordinates.bind(this);
    this.onTowerSelect = this.onTowerSelect.bind(this);
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
    selectedCase: null,
    accountIdNameLookupMap: {},
    selectedCaseJobsList: [],
    width: "96%",
    margin: 8,
    selectedCellChoice: null,
    newJob: {
      id: -1,
      case: -1,
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
      startTime: new Date().setDate(new Date().getDate() - 7).valueOf(),
      endTime: new Date().valueOf(),
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

  onClickEdit(rowData) {
    let query = rowData.query;
    let latitude = rowData.category === "Location" ? query.split(",")[0] : -1,
      longitude = rowData.category === "Location" ? query.split(",")[1] : -1,
      distance = rowData.category === "Location" ? query.split(",")[2] : -1;

    this.setState(
      {
        showReportOnClick: true,
        editMode: true,
        mapKey: this.state.mapKey + 1,
        mapPosition: {
          lat: latitude,
          lng: longitude,
        },
        newJob: {
          id: rowData.id,
          case: rowData.case,
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
          cellId: -1,
          cellId1: -1,
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
    this.toggleDiv();
    this.setState({ width: "100%" });
    this.setState({ margin: 0 });
    this.setState({ activeTab: "Reports" });

    // console.log(this.state.selectedCaseJobsList)
  };
  render() {
    return (
      <div style={{ paddingBottom: 32 }}>
        {this.state.selectedCase && this.getDrawer()}
        {this.state.selectedCase ? (
          <Grid container>
            <Grid style={{ width: this.state.width }}>
              {this.state.currentAccount.modules.checkot.add ||
              this.state.currentAccount.designation === "Admin" ? (
                <div
                  id="div1"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: this.state.margin,
                  }}
                >
                  {this.state.showReportOnClick != true ? (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ backgroundColor: "#18202c" }}
                      onClick={() =>
                        this.setState({
                          drawerOpen: true,
                        })
                      }
                    >
                      Add Job
                    </Button>
                  ) : null}
                </div>
              ) : null}
              {this.state.showReportOnClick
                ? this.getContent()
                : this.getJobsTableComponent()}
            </Grid>
          </Grid>
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
              disableToolbar
              autoOk={true}
              variant="inline"
              margin="normal"
              format="dd/MM/yyyy HH:mm"
              ampm={false}
              openTo="year"
              Date={new Date(this.state.newJob.endTime)}
              label="Target Start Date"
              value={new Date(this.state.newJob.startTime)}
              onChange={(newDate) => {
                const dateTimeData = newDate.c;
                const startDate = new Date(
                  dateTimeData.year,
                  dateTimeData.month - 1,
                  dateTimeData.day,
                  dateTimeData.hour,
                  dateTimeData.minute,
                  dateTimeData.second
                );
                this.setState({
                  newJob: {
                    ...this.state.newJob,
                    startTime: startDate.valueOf(),
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
          {this.state.newJob.type !== "MSISDN Linked" &&
            this.state.newJob.type !== "CellID Linked" && (
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
                  disableToolbar
                  autoOk={true}
                  variant="inline"
                  margin="normal"
                  openTo="year"
                  format="dd/MM/yyyy HH:mm"
                  ampm={false}
                  minDate={new Date(this.state.newJob.startTime)}
                  label="Target End Date"
                  value={new Date(this.state.newJob.endTime)}
                  onChange={(newDate) => {
                    const dateTimeData = newDate.c;
                    const endDate = new Date(
                      dateTimeData.year,
                      dateTimeData.month - 1,
                      dateTimeData.day,
                      dateTimeData.hour,
                      dateTimeData.minute,
                      dateTimeData.second
                    );
                    this.setState({
                      newJob: {
                        ...this.state.newJob,
                        endTime: endDate.valueOf(),
                      },
                    });
                  }}
                />
              </MuiPickersUtilsProvider>
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

  getJobsTableComponent() {
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
      <MaterialTable
        icons={tableIcons}
        style={{ marginTop: 16, marginLeft: "3.8rem" }}
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
          },
          {
            title: "View",
            render: (rowData) => {
              return (
                <div
                  onClick={() => {
                    this.changePage(rowData);
                  }}
                >
                  <VisibilityIcon color="primary" />
                </div>
              );
            },
          },
          { title: "Name", field: "name" },
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
                    {queryArr[0]}
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
          //{ title: "Target-2", field: "query1" },
          { title: "Neighboring Cell-ID's ", field: "radius" },

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
              moment.unix(rowData["startTime"] / 1000).format("DD/MM/YYYY"),
          },
          {
            title: "Start Time",
            field: "startTime",
            align: "center",
            render: (rowData) =>
              moment(rowData["startTime"]).format("HH:mm:ss"),
          },
          {
            title: "End Date",
            field: "endTime",
            align: "center",
            render: (rowData) =>
              moment.unix(rowData["endTime"] / 1000).format("DD/MM/YYYY"),
          },
          {
            title: "End Time",
            field: "endTime",
            align: "center",
            render: (rowData) =>
              moment.unix(rowData["endTime"] / 1000).format("HH:mm"),
          },
          { title: "Number of days", field: "number" },
          { title: "Number of Hours", field: "num" },
          {
            title: "Created On(Date)",
            field: "createdAt",
            align: "center",
            render: (rowData) =>
              moment(rowData["createdAt"]).format("DD/MM/YYYY"),
          },
          {
            title: "Created On(Time)",
            field: "createdAt",
            align: "center",
            render: (rowData) => moment(rowData["createdAt"]).format("HH:mm"),
          },
        ]}
        data={this.state.selectedCaseJobsList}
        title={<MyNewTitle variant="h5" text="Jobs List" />}
        //onRowClick={(event, newVal) => this.setState({ activeTab: newVal },console.log(this.state.selectedCaseJobsList[0]))
        //}
        onRowClick={(event, rowData) => {
          this.changePage(rowData);
        }}
        actions={
          this.state.currentAccount.modules.checkot.edit ||
          this.state.currentAccount.designation === "Admin"
            ? [
                {
                  icon: () => <EditIcon color="primary" />,
                  tooltip: "Edit Job",
                  onClick: (event, rowData) => {
                    this.onClickEdit(rowData);
                  },
                },
                {
                  icon: () => <Delete color="error" />,
                  tooltip: "Delete Job",
                  onClick: (event, rowData) => {
                    // Do Delete operation
                    this.onDeleteButtonPress(rowData);
                  },
                },
                {
                  icon: () => <RefreshIcon color="primary" />,
                  tooltip: "Refresh Table",
                  isFreeAction: true,
                  onClick: (event) =>
                    this.fetchJobsForCase(this.state.selectedCase),
                },
              ]
            : []
        }
      />
    );
  }
  updateCoordinates = async (lat1, lng1, lat2, lng2) => {
    var previewA = lat1.split(",");
    var previewB = lng1.split(",");
    var previewC = lat2.split(",");
    var previewD = lng2.split(",");
    var arr1 = [],
      arr2 = [],
      arr3 = [],
      arr4 = [],
      arr5 = [],
      arrF = [],
      arrFinal = [];
    for (var i = 0; i < previewA.length; i++) {
      arr1.push(parseFloat(previewA[i]));
    }
    for (i = 0; i < previewB.length; i++) {
      arr2.push(parseFloat(previewB[i]));
    }
    for (i = 0; i < previewC.length; i++) {
      arr3.push(parseFloat(previewC[i]));
    }
    for (i = 0; i < previewD.length; i++) {
      arr4.push(parseFloat(previewD[i]));
    }
    for (i = 0; i < previewA.length; i++) {
      arr5.push(parseFloat(previewA[i]));
    }
    arrF.push(arr1);
    arrF.push(arr2);
    arrF.push(arr3);
    arrF.push(arr4);
    arrF.push(arr5);
    arrFinal.push(arrF);

    this.setState({
      editableItem: {
        ...this.state.editableItem,
        lat1: lat1,
        lat2: lat2,
        lng1: lng1,
        lng2: lng2,
      },
      previewPane: arrFinal,
    });
    console.log(
      this.state.editableItem.lat1,
      this.state.editableItem.lat2,
      this.state.editableItem.lng1,
      this.state.editableItem.lng2
    );

    let res = await getCellSites(
      null,
      previewA[0],
      previewC[0],
      previewA[1],
      previewC[1]
    );
    console.log(res);
  };

  componentDidMount() {
    this.getAllAccounts();
    this.getDefaultCase();
  }

  resetToDefault() {
    this.setState({
      drawerOpen: false,
      editMode: false,
      newJob: {
        id: -1,
        name: null,
        case: -1,
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
        cellId1: -1,
        startTime: new Date().setDate(new Date().getDate() - 7).valueOf(),
        endTime: new Date().valueOf(),
        query: "234",
        query1: "234",
        query2: "0",
        radius: "0",
      },
      mapPosition: {
        lat: 9.58817943397567,
        lng: 8.016038970947266,
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
    });
  }

  async getAllAccounts() {
    try {
      let response = await getUsers();
      let accountIdNameLookupMap = {};

      response.forEach((account) => {
        let accountId = account["id"];
        let accountName = account["first_name"] + " " + account["last_name"];
        accountIdNameLookupMap[accountId] = accountName;
      });

      this.setState({
        accountIdNameLookupMap: accountIdNameLookupMap,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getDefaultCase() {
    try {
      let response = await getAllCases();
      response.every((caseItem, index) => {
        let caseName = caseItem["name"];
        if (caseName === DEFAULT_CASE_CHECK_OT) {
          this.setState({ selectedCase: caseItem });
          this.fetchJobsForCase(caseItem);
          return false;
        }
        return true;
      });
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
      this.resetToDefault();
      this.fetchJobsForCase(this.state.selectedCase);
    } catch (error) {
      console.log(error);
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
  toggleDiv() {
    var displayStatus = document.getElementById("div1");
    if (displayStatus.style.display == "none") {
      //If the div is hidden, show it
      displayStatus.style.display = "block";
    } else {
      //If the div is shown, hide it
      displayStatus.style.display = "none";
    }
  }
  getContent() {
    //switch (this.state.showReportOnClick) {
    //case true:

    return (
      <Reports
        currentAccount={this.state.currentAccount}
        fetchCdrForJob={this.state.data}
        data={this.state.data}
      />
    );
    // default:
    //  return null;
  }
}

export default withStyles(styles)(Jobs);
