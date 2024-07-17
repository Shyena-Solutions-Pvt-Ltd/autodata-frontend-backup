/* eslint-disable no-unused-vars */
/* eslint-disable react/no-direct-mutation-state */
import {
  AppBar,
  Toolbar,
  Button,
  Chip,
  FormControl,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  withStyles,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Slide,
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
  Close,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import MaterialTable from "material-table";
import React, { forwardRef } from "react";
import LuxonUtils from "@date-io/luxon";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMoreSharpIcon from "@material-ui/icons/UnfoldMoreSharp";
import MultiSelect from "@khanacademy/react-multi-select";
import InfoIcon from "@material-ui/icons/Info";
import VisibilityIcon from "@material-ui/icons/Visibility";

// Local
import { DEFAULT_CASE_CHECK_OT, FONT_SIZE } from "../../../config";
import AlertCard from "../../../components/alert-card/alert-card.component";
import CaseIntel from "../CaseIntel";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  addCase,
  editCase,
  deleteCase,
  getAllCases,
  getCurrentAccountDetails,
  getDepartments,
  getUsers,
  getJobs,
} from "../../../util/network";
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
    width: "100%",
    flexShrink: 0,
    fontSize: FONT_SIZE,
  },
  drawerPaper: {
    width: "100%",
    height: "100%",
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

class Cases extends React.Component {
  constructor(props) {
    super(props);
    this.getDrawer = this.getDrawer.bind(this);
    this.getCases = this.getCases.bind(this);
    this.getAllAccounts = this.getAllAccounts.bind(this);
    this.changePage = this.changePage.bind(this);
    this.resetToDefault = this.resetToDefault.bind(this);
    this.onCreateOrEditButtonPress = this.onCreateOrEditButtonPress.bind(this);
    this.onAddUserButtonClicked = this.onAddUserButtonClicked.bind(this);
    this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
    this.getDepartmentsList = this.getDepartmentsList.bind(this);
    this.handleTargetAddClick = this.handleTargetAddClick.bind(this);
    this.handleTargetCreateClick = this.handleTargetCreateClick.bind(this);
    this.fetchCurrentAccountDetails =
      this.fetchCurrentAccountDetails.bind(this);
    this.onClose = this.onClose.bind(this);
    this.currentAccount = props.currentAccount;
  }

  state = {
    drawerOpen: false,
    editMode: false,
    targetDialogOpen: false,
    targetTextField: 0,
    activeTab: "",
    editableItem: {
      name: "",
      description: "",
      category: "",
      status: "Open",
      createdAt: "",
      createdBy: "",
      updatedAt: "",
      accounts: [],
      targets: [],
      teamLead: "",
      department: -1,
      startDate: Math.round(new Date().setHours(0, 0, 1, 0) / 1000),
      endDate: Math.round(new Date().setHours(24, 0, -1, -1) / 1000),
    },
    tableData: [],
    jobsCount: {},
    accountObjects: [],
    accountNameOptions: [],
    accountIdNameLookupMap: {},
    userIdNameLookupMap: {},
    departmentOptions: [],
    departmentNameIdMap: {},
    currentTarget: "IMEI",
    targetsObject: { IMEI: [], IMSI: [], MSIS: [] },
    targetNameList: ["0"],
    addUsersDialogOpen: false,
    userOption: [],
    currentAccount: this.props.currentAccount,
    alertOpen: false,
    alertType: "",
    alertTitle: "",
    alertMessage: "",
    selectedCase: null,
  };

  onClose() {
    this.setState({
      alertOpen: false,
    });
  }
  changePage = async (rowData) => {
    await this.setState({ selectedCase: rowData, activeTab: "Case-Intel" });
    await this.props.changePage("Case-Intel", rowData);
    // this.props.changePage("Case-Intel");
    // this.toggleDiv();
  };
  render() {
    const { classes } = this.props;

    if (!this.state.currentAccount) {
      return <div></div>;
    }

    // if (this.state.activeTab === "Case-Intel") {
    //   return (
    //     <CaseIntel
    //       currentAccount={this.currentAccount}
    //       selectedCase={this.state.selectedCase}
    //     />
    //   );
    // }
    return (
      <>
        {this.state.activeTab === "Case-Intel" ? (
          <CaseIntel
            currentAccount={this.currentAccount}
            selectedCase={this.state.selectedCase}
          />
        ) : (
          <div>
            {this.state.alertOpen && (
              <AlertCard
                onClose={this.onClose}
                type={this.state.alertType}
                title={this.state.alertTitle}
                message={this.state.alertMessage}
              />
            )}
            {this.getDrawer()}
            {this.getTargetDialog()}
            <Grid container>
              <Grid item style={{ padding: 16, width: "94%" }}>
                <div
                  id="div1"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 8,
                  }}
                >
                  {this.state.currentAccount.modules.caseot.add ? (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ backgroundColor: "#18202c" }}
                      onClick={() =>
                        this.setState({
                          drawerOpen: true,
                          editableItem: {
                            // name: "",
                            // description: "",
                            // category: "",
                            // status: "Open",
                            // createdAt: "",
                            // createdBy: "",
                            // updatedAt: "",
                            // accounts: [],
                            // targets: [],
                            // teamLead: "",
                            // department: -1,
                            // startDate: Math.round(new Date() / 1000),
                            // endDate: Math.round(new Date() / 1000),
                            ...this.state.editableItem,
                          },
                          editMode: false,
                        })
                      }
                    >
                      Create Case
                    </Button>
                  ) : null}
                </div>
                <MaterialTable
                  icons={tableIcons}
                  components={{
                    Container: (props) => <Paper {...props} elevation={0} />,
                  }}
                  options={{
                    actionsColumnIndex: -1,
                    paging: true,
                    pageSize:10,
                    pageSizeOptions:[5,10,20,50,100],
                    paginationType: 'normal',
                    grouping: true,
                    rowStyle: {
                      fontSize: FONT_SIZE,
                    },
                    headerStyle: {
                      fontSize: FONT_SIZE,
                    },
                  }}
                  columns={[
                    {
                      title: "ID",
                      field: "id",
                      type: "numeric",
                      align: "left",
                      width: 16,
                    },
                    { title: "Name", field: "name" },
                    { title: "Description", field: "description" },
                    { title: "Created By", field: "createdByName" },
                    { title: "Category", field: "category" },
                    {
                      title: "Status",
                      field: "status",
                      render: (rowData) => (
                        <span
                          style={{
                            color: rowData.status === "Open" ? "green" : "red",
                          }}
                        >
                          {rowData.status}
                        </span>
                      ),
                    },
                    {
                      title: "Users",
                      field: "accounts",
                      grouping: false,
                      render: (rowData) => (
                        <div>
                          {rowData.accounts.map((user, index) => (
                            <Chip
                              key={index}
                              label={user}
                              className={classes.chip}
                            />
                          ))}
                        </div>
                      ),
                    },
                    {
                      title: "Jobs",
                      field: "jobs",
                      render: (rowData) => this.state.jobsCount[rowData.id],
                    },
                    // { title: "Case Info", field: "caseintel" },
                  ]}
                  data={this.state.tableData}
                  title="Case List"
                  actions={
                    this.state.currentAccount.modules.caseot.edit ||
                    this.state.currentAccount.designation === "Admin"
                      ? [
                          {
                            icon: () => (
                              <Button
                                variant="contained"
                                color="primary"
                                className={classes.buttonStyle}
                              >
                                Add User
                              </Button>
                            ),
                            tooltip: "Add Users",
                            onClick: (event, rowData) => {
                              let editableItem = Object.assign({}, rowData);
                              let selectedCaseAccountNames =
                                editableItem["accounts"];
                              let accountsObjectsList =
                                this.state.accountObjects;

                              let editableItemAccounts = [];
                              selectedCaseAccountNames.forEach(
                                (accountName) => {
                                  accountsObjectsList.forEach(
                                    (accountObject) => {
                                      if (
                                        accountName ===
                                        accountObject["first_name"] +
                                          " " +
                                          accountObject["last_name"]
                                      ) {
                                        editableItemAccounts.push(
                                          String(accountObject["id"])
                                        );
                                      }
                                    }
                                  );
                                }
                              );
                              editableItem["accounts"] = editableItemAccounts;
                              this.setState({
                                editableItem: editableItem,
                                addUsersDialogOpen:
                                  !this.state.addUsersDialogOpen,
                                targetNameList: editableItem.target,
                              });
                            },
                          },
                          {
                            icon: () => <VisibilityIcon color="primary" />,
                            tooltip: "View Jobs",
                            onClick: (event, rowData) => {
                              this.changePage(rowData);
                            },
                          },
                          // {
                          //   icon: () => <Add />,
                          //   tooltip: "Add Target",
                          //   onClick: (event, rowData) => {
                          //     let editableItem = Object.assign({}, rowData);
                          //     let selectedCaseAccountNames =
                          //       editableItem["accounts"];
                          //     let accountsObjectsList = this.state.accountObjects;
                          //     let editableItemAccounts = [];
                          //     selectedCaseAccountNames.forEach((accountName) => {
                          //       accountsObjectsList.forEach((accountObject) => {
                          //         if (
                          //           accountName ===
                          //           accountObject["first_name"] +
                          //             " " +
                          //             accountObject["last_name"]
                          //         ) {
                          //           editableItemAccounts.push(accountObject);
                          //         }
                          //       });
                          //     });
                          //     let targets = editableItem["targets"];
                          //     let imeiList = [];
                          //     let imsiList = [];
                          //     let msisdnList = [];
                          //     editableItem["accounts"] = editableItemAccounts;
                          //     targets
                          //       .filter((t) => t.substring(2, 3) === "E")
                          //       .map((target) =>
                          //         imeiList.push(target.substring(5, target.length))
                          //       );
                          //     targets
                          //       .filter((t) => t.substring(2, 3) === "S")
                          //       .map((target) =>
                          //         imsiList.push(target.substring(5, target.length))
                          //       );
                          //     targets
                          //       .filter((t) => t.substring(2, 3) === "I")
                          //       .map((target) =>
                          //         msisdnList.push(
                          //           target.substring(5, target.length)
                          //         )
                          //       );
                          //     let targetObject = {};
                          //     targetObject["IMEI"] = imeiList;
                          //     targetObject["IMSI"] = imsiList;
                          //     targetObject["MSIS"] = msisdnList;

                          //     this.setState({
                          //       ...this.state.targetsObject,
                          //       targetsObject: targetObject,
                          //     });
                          //     this.setState({
                          //       editableItem: editableItem,
                          //       editMode: true,
                          //       targetDialogOpen: !this.state.targetDialogOpen,
                          //     });
                          //   },
                          // },
                          {
                            icon: () => <Edit />,
                            tooltip: "Edit Case",
                            onClick: (event, rowData) => {
                              // Do edit operation
                              let editableItem = Object.assign({}, rowData);
                              let selectedCaseAccountNames =
                                editableItem["accounts"];
                              let accountsObjectsList =
                                this.state.accountObjects;

                              let editableItemAccounts = [];
                              selectedCaseAccountNames.forEach(
                                (accountName) => {
                                  accountsObjectsList.forEach(
                                    (accountObject) => {
                                      if (
                                        accountName ===
                                        accountObject["first_name"] +
                                          " " +
                                          accountObject["last_name"]
                                      ) {
                                        editableItemAccounts.push(
                                          accountObject
                                        );
                                      }
                                    }
                                  );
                                }
                              );
                              editableItem["accounts"] = editableItemAccounts;
                              let departmentObjectList =
                                this.state.departmentNameIdMap;
                              Object.keys(departmentObjectList).forEach(
                                function (key) {
                                  if (
                                    editableItem.department ===
                                    departmentObjectList[key]
                                  ) {
                                    editableItem.department = key;
                                  }
                                }
                              );
                              this.setState({
                                drawerOpen: true,
                                editableItem: editableItem,
                                editMode: true,
                                targetNameList: editableItem.target,
                              });
                            },
                          },
                          // {
                          //   icon: () => <Delete color="error" />,
                          //   tooltip: "Delete Case",
                          //   onClick: (event, rowData) => {
                          //     // Do Delete operation
                          //     this.onDeleteButtonPress(rowData);
                          //   },
                          // },
                        ]
                      : []
                  }
                />
              </Grid>
            </Grid>
            {this.getAddUserDrawer()}
          </div>
        )}
      </>
    );
  }
  getTargetDialog() {
    const { classes } = this.props;

    return (
      <Dialog
        aria-labelledby="customized-dialog-title"
        classes={{
          paper: classes.drawerPaper,
        }}
        open={this.state.targetDialogOpen}
        onClose={() => this.resetToDefault()}
      >
        <AppBar position="static" style={{ backgroundColor: "#18202c" }}>
          <Toolbar>
            <Grid justify="space-between" container>
              <Grid item>
                <Typography
                  variant="h2"
                  color="inherit"
                  className={classes.title}
                >
                  Add Targets
                </Typography>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="close"
                  className={classes.closeButton}
                  onClick={this.resetToDefault}
                  color="inherit"
                >
                  <Close />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className={classes.drawercontent}>
            <FormControl style={{ marginTop: 10, minWidth: "100%" }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                className={classes.field}
                value={this.state.currentTarget}
                onChange={(event) =>
                  this.setState({
                    ...this.state,
                    currentTarget: event.target.value,
                  })
                }
              >
                <MenuItem value={"IMSI"} className={classes.field}>
                  IMSI
                </MenuItem>
                <MenuItem value={"IMEI"} className={classes.field}>
                  IMEI
                </MenuItem>
                <MenuItem value={"MSIS"} className={classes.field}>
                  MSISDN
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Targets"
              style={{ marginTop: 16 }}
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
              variant="outlined"
              fullWidth
              type="text"
              placeholder="Enter targets"
              value={this.state.targetTextField}
              onChange={(event) =>
                this.setState({
                  ...this.state,
                  targetTextField: event.target.value,
                })
              }
            />
            <Button
              type="submit"
              style={{ marginTop: 16, marginLeft: 5, minWidth: "100%" }}
              variant="contained"
              fullwidth
              onClick={this.handleTargetAddClick}
            >
              Add
            </Button>

            <List>
              {this.state.targetsObject[this.state.currentTarget].map(
                (title, key) => {
                  return (
                    <ListItem key={key}>
                      <ListItemText key={key} className={classes.field}>
                        {title}
                      </ListItemText>
                      <ListItemSecondaryAction key={key}>
                        <IconButton
                          key={key}
                          data-index={key}
                          onClick={(event) =>
                            console.log(event.target.getAttribute("key"))
                          }
                        >
                          <DeleteIcon key={key} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                }
              )}
            </List>

            <DialogActions>
              <Button
                onClick={this.handleTargetCreateClick}
                variant="contained"
                style={{ marginTop: 16, marginLeft: 5, minWidth: "100%" }}
                fullwidth
                color="primary"
              >
                Create Target
              </Button>
            </DialogActions>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  getAddUserDrawer() {
    const { classes } = this.props;
    const options = this.state.userOption;
    let selectedUsers = this.state.editableItem.accounts;

    return (
      <Dialog
        aria-labelledby="customized-dialog-title"
        classes={{
          paper: classes.drawerPaper,
        }}
        open={this.state.addUsersDialogOpen}
        onClose={() => this.resetToDefault()}
      >
        <AppBar position="static" style={{ backgroundColor: "#18202c" }}>
          <Toolbar>
            <Grid justify="space-between" container>
              <Grid item>
                <Typography
                  variant="h2"
                  color="inherit"
                  className={classes.title}
                >
                  Add Users
                </Typography>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="close"
                  className={classes.closeButton}
                  onClick={this.resetToDefault}
                  color="inherit"
                >
                  <Close />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {
            <div className={classes.drawercontent}>
              <MultiSelect
                options={options}
                className={classes.field}
                selected={selectedUsers}
                onChange={(...args) => console.log(...args)}
                onSelectedChanged={(selected) => {
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      accounts: selected,
                    },
                  });
                }}
              />
              <DialogActions>
                <Button
                  onClick={this.onAddUserButtonClicked}
                  variant="contained"
                  style={{ marginTop: 16, marginLeft: 5, minWidth: "100%" }}
                  fullwidth
                  color="primary"
                >
                  Add User
                </Button>
              </DialogActions>
              <Typography variant="h2" color="inherit">
                Selected Users
              </Typography>

              {selectedUsers.map((cid) =>
                this.state.accountObjects.map((account) =>
                  cid === account["id"] ? (
                    <Typography variant="h2" color="inherit">
                      {account.first_name + " " + account.last_name}
                    </Typography>
                  ) : null
                )
              )}
            </div>
          }
        </DialogContent>
      </Dialog>
    );
  }
  getDrawer() {
    const { classes } = this.props;
    return (
      <Dialog
        fullScreen
        open={this.state.drawerOpen}
        onClose={() => this.resetToDefault()}
        TransitionComponent={this.Transition}
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
            <Typography variant="h2" className={classes.title}>
              {this.state.editMode ? "Edit Case" : "Add Case"}
            </Typography>
            <Button
              type="submit"
              form="CaseForm"
              variant="contained"
              color="primary"
              startIcon={this.state.editMode ? <Edit /> : <Add />}
              //onClick={this.onCreateOrEditButtonPress}
            >
              {this.state.editMode ? "Update" : "Create"}
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.drawercontent}>
          <form
            id="CaseForm"
            onSubmit={(event) => {
              event.preventDefault();
              this.onCreateOrEditButtonPress();
            }}
          >
            <TextField
              label="Name"
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
              fullWidth
              required
              value={this.state.editableItem.name}
              onChange={(event) =>
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    name: event.target.value,
                  },
                })
              }
            />

            <TextField
              label="Description"
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
              multiline
              fullWidth
              required
              style={{ marginTop: 16 }}
              value={this.state.editableItem.description}
              onChange={(event) =>
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    description: event.target.value,
                  },
                })
              }
            />

            <FormControl style={{ marginTop: 16, minWidth: "100%" }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                required
                className={classes.field}
                value={this.state.editableItem.category}
                onChange={(event) =>
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      category: event.target.value,
                    },
                  })
                }
              >
                <MenuItem value={"Robbery"}>Robbery</MenuItem>
                <MenuItem value={"Bomb Blast"}>Bomb Blast</MenuItem>
              </Select>
            </FormControl>

            {/* <FormControl style={{ marginTop: 16, minWidth: "100%" }}>
              <InputLabel id="head-label">Created By</InputLabel>
              <Select
                labelId="lead-label"
                className={classes.field}
                value={this.state.editableItem.createdBy}
                fullWidth
                required
                onChange={(event) =>
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      createdBy: event.target.value,
                    },
                  })
                }
              > */}
            {/* {this.state.accountObjects.filter((object) => (
                  <MenuItem key={object["id"]} value={object["id"]}>
                    {object["first_name"]}
                  </MenuItem>
                ))} */}

            {/* {this.state.accountObjects
                  .filter(
                    (object) => this.state.currentAccount["id"] === object["id"]
                  )
                  .map((object) => (
                    <MenuItem key={object["id"]} value={object["id"]}>
                      {object["first_name"]}
                    </MenuItem>
                  ))} */}
            {/* </Select>
            </FormControl> */}

            {this.state.editMode && (
              <FormControl style={{ marginTop: 16, minWidth: "100%" }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  className={classes.field}
                  fullWidth
                  required
                  value={this.state.editableItem.status}
                  onChange={(event) =>
                    this.setState({
                      editableItem: {
                        ...this.state.editableItem,
                        status: event.target.value,
                      },
                    })
                  }
                >
                  <MenuItem value={"Open"}>Open</MenuItem>
                  <MenuItem value={"Close"}>Close</MenuItem>
                  <MenuItem value={"Delayed"}>Delayed</MenuItem>
                </Select>
              </FormControl>
            )}

            <Autocomplete
              style={{ marginTop: 16, minWidth: "100%" }}
              multiple
              required
              options={this.state.accountObjects}
              getOptionLabel={(option) =>
                option["first_name"] + " " + option["last_name"]
              }
              value={this.state.editableItem.accounts}
              onChange={(event, value) =>
                this.setState({
                  editableItem: { ...this.state.editableItem, accounts: value },
                })
              }
              renderInput={(params) => (
                <TextField {...params} variant="standard" label="Accounts" />
              )}
            />

            <FormControl style={{ marginTop: 16, minWidth: "100%" }}>
              <InputLabel id="head-label">Team Lead</InputLabel>
              <Select
                labelId="lead-label"
                className={classes.field}
                value={this.state.editableItem.teamLead}
                fullWidth
                required
                onChange={(event) =>
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      teamLead: event.target.value,
                    },
                  })
                }
              >
                {this.state.accountObjects.map((object) => (
                  <MenuItem key={object["id"]} value={object["id"]}>
                    {object["first_name"]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ marginTop: 18, minWidth: "100%" }}>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                className={classes.field}
                fullWidth
                required
                value={this.state.editableItem.department}
                onChange={(event) =>
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      department: event.target.value,
                    },
                  })
                }
              >
                {this.state.departmentOptions.map((deptName) => (
                  <MenuItem key={deptName} value={deptName}>
                    {deptName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <KeyboardDatePicker
                style={{ marginTop: 16, minWidth: "100%" }}
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
                format="dd/MM/yyyy"
                ampm={false}
                label="Case Start Date"
                value={new Date(this.state.editableItem.startDate * 1000)}
                // onChange={(newDate) => {
                //   const dateTimeData = newDate.c;
                //   const startDate = new Date(
                //     dateTimeData.year,
                //     dateTimeData.month - 1,
                //     dateTimeData.day,
                //     dateTimeData.hour,
                //     dateTimeData.minute,
                //     dateTimeData.second
                //   );
                //   this.setState({
                //     editableItem: {
                //       ...this.state.editableItem,
                //       startDate: startDate.valueOf(),
                //     },
                //   });
                // }}
                onChange={(newDate) =>
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      startDate: Math.round(newDate / 1000),
                    },
                  })
                }
              />
            </MuiPickersUtilsProvider>

            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <KeyboardDatePicker
                style={{ marginTop: 16, minWidth: "100%" }}
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
                format="dd/MM/yyyy"
                ampm={false}
                label="Case End Date"
                value={new Date(this.state.editableItem.endDate * 1000)}
                // onChange={(newDate) => {
                //   const dateTimeData = newDate.c;
                //   const endDate = new Date(
                //     dateTimeData.year,
                //     dateTimeData.month - 1,
                //     dateTimeData.day,
                //     dateTimeData.hour,
                //     dateTimeData.minute,
                //     dateTimeData.second
                //   );
                //   this.setState({
                //     editableItem: {
                //       ...this.state.editableItem,
                //       endDate: endDate.valueOf(),
                //     },
                //   });
                // }}
                onChange={(newDate) =>
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      endDate: Math.round(newDate / 1000),
                    },
                  })
                }
              />
            </MuiPickersUtilsProvider>
          </form>
        </div>
      </Dialog>
    );
  }

  componentDidMount() {
    this.fetchCurrentAccountDetails();
    this.getCases();
    this.getDepartmentsList();
  }
  componentDidUpdate() {
    if (this.state.alertOpen) {
      setTimeout(() => this.setState({ alertOpen: false }), 5000);
    }
  }
  async fetchCurrentAccountDetails() {
    try {
      let response = await getCurrentAccountDetails();
      this.setState({
        currentAccount: response,
        editableItem: {
          ...this.state.editableItem,
          createdBy: response["user"],
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getDepartmentsList() {
    try {
      let response = await getDepartments();

      let departmentOptions = new Set();
      let departmentNameIdMap = {};

      response.forEach((department) => {
        departmentOptions.add(department["name"]);
        departmentNameIdMap[department["name"]] = department["id"];
      });

      departmentOptions = Array.from(departmentOptions);
      this.setState({
        departmentOptions: departmentOptions,
        departmentNameIdMap: departmentNameIdMap,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getCases() {
    try {
      await this.getAllAccounts();
      let response = [];

      if (this.state.currentAccount["designation"] === "Admin") {
        response = await getAllCases();
      } else {
        response = await getAllCases(this.state.currentAccount["id"]);
      }
      response = response.filter(
        (caseItem, index) => caseItem["name"] !== DEFAULT_CASE_CHECK_OT
      );
      response.forEach((caseItem, index) => {
        let accountsForCase = caseItem["accounts"];
        let accountNamesForCase = [];
        accountsForCase.forEach((accountId) => {
          accountNamesForCase.push(
            this.state.accountIdNameLookupMap[accountId]
          );
        });
        response[index]["accounts"] = accountNamesForCase;
      });

      response.forEach((caseItem, index) => {
        let createdBy = caseItem["createdBy"];
        let createdAccountName = "";
        createdAccountName = this.state.accountIdNameLookupMap[createdBy];
        if (!createdAccountName) {
          createdAccountName = this.state.userIdNameLookupMap[createdBy];
        }
        response[index]["createdByName"] = createdAccountName;
        response[index]["createdBy"] = createdBy;
      });

      //get jobs count
      let count = {};

      await Promise.all(
        response.map(async (item) => {
          const jobs = await getJobs(item.id);
          count[item.id] = jobs.length;
        })
      );

      this.setState({ jobsCount: count });

      response.sort(function (a, b) {
        return b.id - a.id;
      });

      this.setState({ tableData: response });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllAccounts() {
    try {
      let response = await getUsers();

      let accountNameOptions = new Set();
      let accountIdNameLookupMap = {};
      let userIdNameLookupMap = {};

      let accountObjects = [];

      console.log(response);

      response.forEach((account) => {
        let accountId = account["id"];
        let userId = account["user_id"];
        let accountName = account["first_name"] + " " + account["last_name"];
        accountNameOptions.add(accountName);
        accountIdNameLookupMap[accountId] = accountName;
        userIdNameLookupMap[userId] = accountName;
        accountObjects.push(account);
      });

      accountNameOptions = Array.from(accountNameOptions);

      this.setState(
        {
          accountNameOptions: accountNameOptions,
          accountIdNameLookupMap: accountIdNameLookupMap,
          userIdNameLookupMap: userIdNameLookupMap,
          accountObjects: accountObjects,
        },
        () => {
          let userOption = [];
          for (const [key, value] of Object.entries(
            this.state.accountIdNameLookupMap
          )) {
            userOption.push({ label: value, value: key });
          }
          this.setState({
            userOption: userOption,
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  resetToDefault() {
    this.setState({
      drawerOpen: false,
      editMode: false,
      targetNameList: ["0"],
      editableItem: {
        name: "",
        description: "",
        category: "",
        status: "Open",
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        accounts: [],
        targets: [],
        teamLead: "",
        department: -1,
        startDate: Math.round(new Date().setHours(0, 0, 1, 0) / 1000),
        endDate: Math.round(new Date().setHours(24, 0, -1, -1) / 1000),
      },
      targetDialogOpen: false,
      addUsersDialogOpen: false,
    });
  }

  async onCreateOrEditButtonPress() {
    try {
      let payload = this.state.editableItem;
      console.log(payload);
      let departmentObjectList = this.state.departmentNameIdMap;
      Object.keys(departmentObjectList).forEach(function (key) {
        if (payload.department === key) {
          payload.department = departmentObjectList[key];
        }
      });
      payload.targets = this.state.targetNameList;
      let accountsObjectsList = payload.accounts;
      let accountNames = [];
      let message;

      accountsObjectsList.forEach((accountObject) => {
        accountNames.push(accountObject["id"]);
      });
      payload.accounts = accountNames;
      if (this.state.editMode) {
        let response = await editCase(payload.id, payload);
        message = "Case Edited Successfully";
      } else {
        let response = await addCase(payload);
        message = "Case Added Successfully";
      }
      this.setState({
        alertType: "success",
        alertTitle: "Case",
        alertMessage: message,
        alertOpen: true,
      });
      this.resetToDefault();
      this.componentDidMount();
    } catch (error) {
      this.setState({
        alertType: "error",
        alertTitle: "Error",
        alertMessage: error.toString(),
        alertOpen: true,
      });
      console.log(error);
    }
  }

  async onAddUserButtonClicked() {
    try {
      let payload = this.state.editableItem;
      let departmentObjectList = this.state.departmentNameIdMap;
      Object.keys(departmentObjectList).forEach(function (key) {
        if (payload.department === key) {
          payload.department = departmentObjectList[key];
        }
      });
      payload.targets = this.state.targetNameList;

      let response = await editCase(payload.id, payload);
      this.setState({
        alertType: "success",
        alertTitle: "Add User",
        alertMessage: "User Added Successfully",
        alertOpen: true,
      });
      this.resetToDefault();
      this.componentDidMount();
    } catch (error) {
      this.setState({
        alertType: "error",
        alertTitle: "Error",
        alertMessage: error.toString(),
        alertOpen: true,
      });
      console.log(error);
    }
  }

  handleTargetAddClick() {
    var currentList = [];
    let target = this.state.currentTarget;
    currentList = this.state.targetsObject[target];
    currentList.push(this.state.targetTextField);
    this.setState({
      targetsObject: { ...this.state.targetsObject, [target]: currentList },
    });
  }
  handleTargetCreateClick() {
    let targetList = [];
    let imeiList = [];
    this.state.targetsObject["IMEI"].forEach((string, index) => {
      imeiList[index] = "IMEI:" + string;
      targetList.push(imeiList[index]);
    });
    let imsiList = [];
    this.state.targetsObject["IMSI"].forEach((string, index) => {
      imsiList[index] = "IMSI:" + string;
      targetList.push(imsiList[index]);
    });
    let msisdnList = [];
    this.state.targetsObject["MSIS"].forEach((string, index) => {
      msisdnList[index] = "MSIS:" + string;
      targetList.push(msisdnList[index]);
    });
    this.setState({
      targetNameList: targetList,
      editMode: true,
    });
    this.state.targetNameList = targetList;
    this.onCreateOrEditButtonPress();
    this.resetToDefault();
    this.setState({
      targetDialogOpen: !this.state.targetDialogOpen,
    });
  }

  async onDeleteButtonPress(rowData) {
    try {
      let response = await deleteCase(rowData.id);
      this.resetToDefault();
      this.componentDidMount();
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
      <CaseIntel
        currentAccount={this.state.currentAccount}
        fetchCdrForJob={this.state.data}
        data={this.state.data}
      />
    );
    // default:
    //  return null;
  }
}

export default withStyles(styles)(Cases);
