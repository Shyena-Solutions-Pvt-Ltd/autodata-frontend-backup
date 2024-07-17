import { Tab, Tabs, withStyles } from "@material-ui/core";
import { ExitToApp, Home } from "@material-ui/icons";
import React from "react";
// Local
import CustomAppBar from "../../components/CustomAppBar";
import { getCurrentAccountDetails } from "../../util/network";
import Jobs from "./Jobs";
import Reports from "./Reports";

const styles = (theme) => ({
  chip: {
    margin: theme.spacing(0.5),
  },
  tabs: {
    backgroundColor: "#2c405e",
  },
});

class CheckOT extends React.Component {
  constructor(props) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
    this.getContent = this.getContent.bind(this);
  }

  state = {
    activeTab: "Jobs",
    currentAccount: null,
    id: 0,
    showTab: false,
    selectedCase: {
      id: 0,
      name: "Default",
      description: "Default Case for all Check OT jobs",
      category: "Other",
      type: "Other",
      number: "0",
      status: "Open",
      users: [],
    },
    selectedJob: {
      id: "",
      case: 0,
      serverJobId: -1,
      status: "",
      category: "",
      type: "",
      number: "",
      eventStartDate: "",
      eventEndDate: "",
    },
  };

  render() {
    if (!this.state.currentAccount) {
      return <div></div>;
    }
    return (
      <div>
        {this.getHeader()}
        {this.getContent()}
      </div>
    );
  }

  componentDidMount() {
    this.fetchCurrentAccountDetails();
  }

  async fetchCurrentAccountDetails() {
    try {
      let response = await getCurrentAccountDetails();
      this.setState({
        currentAccount: response,
      });
    } catch (error) {
      console.log(error);
    }
  }

  getHeader() {
    const { classes } = this.props;

    return (
      <div>
        <CustomAppBar
          currentAccount={this.state.currentAccount}
          title="Check OT"
          leadingIcon={<Home />}
          onLeadingIconPress={() => (window.location = "/landing")}
          trailingIcon={<ExitToApp />}
          onTrailingIconPress={() => (window.location = "/")}
        />

        <Tabs
          className={classes.tabs}
          variant="fullWidth"
          centered
          value={this.state.activeTab}
          onChange={(event, newVal) => this.setState({ activeTab: newVal })}
        >
          <Tab
            onClick={() =>
              this.state.activeTab == "Jobs"
                ? (window.location = "/check")
                : null
            }
            label={<b style={{ color: "white" }}>Jobs</b>}
            value="Jobs"
          />
          <Tab
            label={<b style={{ color: "white" }}>Reports</b>}
            value="Reports"
          />
        </Tabs>
      </div>
    );
  }

  getContent() {
    switch (this.state.activeTab) {
      case "Jobs":
        return (
          <Jobs
            currentAccount={this.state.currentAccount}
            selectedJob={this.state.selectedJob}
            onRowSelect={(event, selectedRow) =>
              this.setState({ selectedJob: selectedRow, id: selectedRow["id"] })
            }
          />
        );
      default:
        return (
          <Reports
            currentAccount={this.state.currentAccount}
            //fetchCdrForJob={this.state.selectedJob}
            //data = {this.state.selectedJob}
            //{...console.log('okok',this.state.id)}
            //onClick={(event, selectedRow) => this.setState({ selectedJob: selectedRow })}
          />
        );
    }
  }
}

export default withStyles(styles)(CheckOT);
