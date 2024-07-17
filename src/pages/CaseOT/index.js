import React from "react";
import { withStyles, Tabs, Tab } from "@material-ui/core";
import { Home, ExitToApp } from "@material-ui/icons";

import { getCurrentAccountDetails } from "../../util/network";

// Local
import CustomAppBar from "../../components/CustomAppBar";
import Cases from "./Cases";
import CaseIntel from "./CaseIntel/index";
import CaseIntelAuto from "./CaseIntel/indexauto";
import Zones from "./Zones";
import POI from "./POI";

const styles = (theme) => ({
  tabs: {
    backgroundColor: "#2c405e",
  },
});

class CaseOT extends React.Component {
  constructor(props) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
    this.getContent = this.getContent.bind(this);
    this.onSelectCase = this.onSelectCase.bind(this);
    this.changePage = this.changePage.bind(this);
    this.fetchCurrentAccountDetails =
      this.fetchCurrentAccountDetails.bind(this);
  }

  state = {
    activeTab: "Cases",
    currentAccount: null,
    selectedCase: null,
    autoRead: false,
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
          title="Case OT"
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
          onChange={(event, newVal) =>
            this.setState({ activeTab: newVal, autoRead: false })
          }
        >
          <Tab
            onClick={() =>
              this.state.activeTab == "Cases"
                ? (window.location = "/case")
                : null
            }
            label={<b style={{ color: "white" }}>Cases</b>}
            value="Cases"
          />
          <Tab
            label={<b style={{ color: "white" }}>Case Info</b>}
            value="Case-Intel"
          />
          {/* <Tab label={<b style={{ color: 'white' }}>Zones</b>} value='Zones' />
                    <Tab label={<b style={{ color: 'white' }}>POI</b>} value='POI' /> */}
        </Tabs>
      </div>
    );
  }

  onSelectCase(selectedCase) {
    this.setState({ selectedCase: selectedCase });
  }
  changePage(tabName, selectedCase) {
    this.setState({
      activeTab: tabName,
      selectedCase: selectedCase,
      autoRead: true,
    });
  }

  getContent() {
    return (
      <div>
        {this.state.activeTab === "Cases" ? (
          <Cases
            currentAccount={this.state.currentAccount}
            changePage={this.changePage}
            onSelectCase={this.onSelectCase}
            selectedCase={this.state.selectedCase}
          />
        ) : (
          <div />
        )}
        {this.state.activeTab === "Case-Intel" &&
        this.state.autoRead === false ? (
          <CaseIntel
            currentAccount={this.state.currentAccount}
            changePage={this.changePage}
            onSelectCase={this.onSelectCase}
            selectedCase={this.state.selectedCase}
          />
        ) : (
          <div />
        )}
        {this.state.activeTab === "Case-Intel" &&
        this.state.autoRead === true ? (
          <CaseIntelAuto
            currentAccount={this.state.currentAccount}
            changePage={this.changePage}
            onSelectCase={this.onSelectCase}
            selectedCase={this.state.selectedCase}
          />
        ) : (
          <div />
        )}
        {/* {this.state.activeTab === "Zones" ? (
          <Zones currentAccount={this.state.currentAccount} />
        ) : (
          <div />
        )}
        {this.state.activeTab === "POI" ? (
          <POI currentAccount={this.state.currentAccount} />
        ) : (
          <div />
        )} */}
      </div>
    );
  }
}

export default withStyles(styles)(CaseOT);
