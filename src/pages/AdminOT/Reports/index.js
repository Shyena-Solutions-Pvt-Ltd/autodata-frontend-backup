/* eslint-disable no-unused-vars */
import {
  Button,
  Typography,
  withStyles,
  AppBar,
  Toolbar,
} from "@material-ui/core";



import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import { Add, Edit } from "@material-ui/icons";
//Date Utils
import LuxonUtils from "@date-io/luxon";

import React from "react";
import { drawerWidth, FONT_SIZE, HEADER_FONT_SIZE } from "../../../config";
import AlertCard from "../../../components/alert-card/alert-card.component";
import { Formik, Form } from "formik";

import * as Yup from "yup";

import { generateReport,generateJobReport } from "../../../util/network";

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

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.getForm = this.getForm.bind(this);
    this.onCreateOrEditButtonPress = this.onCreateOrEditButtonPress.bind(this);
    this.resetToDefault = this.resetToDefault.bind(this);
  }

  state = {
    currentAccount: this.props.currentAccount,
    drawerOpen: false,
    editableItem: {
      startDate: Math.round(new Date().setHours(0, 0, 1, 0) / 1000),
      endDate: Math.round(new Date().setHours(24, 0, -1, -1) / 1000),
    },
    alertType: "",
    alertTitle: "",
    alertMessage: "",
    alertOpen: false,
    loading:false
  };

  render() {

       const { loading } = this.state;

    return (
      <div>
        {this.state.alertOpen && (
          <AlertCard
            type={this.state.alertType}
            title={this.state.alertTitle}
            message={this.state.alertMessage}
          />
        )}
        {this.getForm()}
      </div>
    );
  }


  getForm() {
    const { classes } = this.props;
    const validationSchema = Yup.object().shape({
      startDate: Yup.string().required("Required"),
      endDate: Yup.string().required("Required"),
    });

    return (
      <div>
        <Formik
          initialValues={this.state.editableItem}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            this.onCreateOrEditButtonPress();
          }}
        >
          {({ errors, touched, handleChange, submitForm, isSubmitting }) => (
            <Form id="DepartmentForm" style={{ margin: "7%" }}>
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <Typography variant="h2" className={classes.title}>
                    Generate Report
                  </Typography>
                </Toolbar>
              </AppBar>
              <div className={classes.drawercontent}>
                <MuiPickersUtilsProvider utils={LuxonUtils}>
                  <KeyboardDatePicker
                    style={{
                      marginTop: 16,
                      minWidth: "100%",
                      fontSize: FONT_SIZE,
                    }}
                    InputProps={{
                      classes: {
                        input: classes.field,
                      },
                    }}
                    autoOk={true}
                    margin="normal"
                    format="dd/MM/yyyy"
                    ampm={false}
                    label="Start Date"
                    value={new Date(this.state.editableItem.startDate * 1000)}
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
                <br />
                <MuiPickersUtilsProvider utils={LuxonUtils}>
                  <KeyboardDatePicker
                    style={{
                      marginTop: 16,
                      minWidth: "100%",
                      fontSize: FONT_SIZE,
                    }}
                    InputProps={{
                      classes: {
                        input: classes.field,
                      },
                    }}
                    autoOk={true}
                    margin="normal"
                    format="dd/MM/yyyy"
                    ampm={false}
                    label="End Date"
                    value={new Date(this.state.editableItem.endDate * 1000)}
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
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {this.state.loading ? (<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'blue', fontSize: '24px' }} >Loading...</div>):(
                   <Button
                   variant="contained"
                   color="primary"
                   startIcon={<Add />}
                   disabled={isSubmitting}
                   onClick={submitForm}
                 >
                   {"Generate"}
                 </Button>
                )}
               
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }

  async componentDidMount() {}

  async onCreateOrEditButtonPress() {
    try {
      this.setState({ loading: true }); 
  
      let payload = this.state.editableItem;
      let message;
  
      let response = await generateJobReport(payload);
  
      if (response.status === 200) {
        message = "Report Generated Successfully";
  
        // Create a URL object from the binary data received in the response
        const url = window.URL.createObjectURL(new Blob([response.data]));
  
        // Create a temporary link to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.xlsx");
        document.body.appendChild(link);
        link.click();
  
        // Clean up the temporary link and URL object
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
  
        this.setState({
          drawerOpen: false,
          editableItem: {
            startDate: Math.round(new Date().setHours(0, 0, 1, 0) / 1000),
            endDate: Math.round(new Date().setHours(24, 0, -1, -1) / 1000),
          },
          alertType: "success",
          alertTitle: "Report",
          alertMessage: message,
          alertOpen: true,
          loading: false, 
        });
        this.componentDidMount();
      }
    } catch (error) {
      this.setState({
        alertType: "error",
        alertTitle: "Error",
        alertMessage: error.toString(),
        alertOpen: true,
        loading: false, // Set loading state to false in case of error
      });
      console.log(error);
    }
  }
  

  resetToDefault() {
    this.setState({
      drawerOpen: false,
      editableItem: {
        startDate: Math.round(new Date().setHours(0, 0, 1, 0) / 1000),
        endDate: Math.round(new Date().setHours(24, 0, -1, -1) / 1000),
      },
    });
  }
}

export default withStyles(styles)(Reports);
