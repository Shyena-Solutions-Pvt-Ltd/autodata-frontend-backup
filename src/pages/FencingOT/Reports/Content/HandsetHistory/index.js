import {
  Typography,
  withStyles,
  Card,
  CardActions,
  CardContent
} from '@material-ui/core';
import React from 'react';

// Local
import HandsetHistoryGraph1 from "./HandsetHistoryGraph";
import HandsetHistoryGraph from "./HandsetHistoryXrange";
import HandsetHistoryTable from './Table';
import { getHandsetHistory } from '../../../../../util/network';

const styles = theme => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  
  
});

class HandsetHistory extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fetchHandsetHistory = this.fetchHandsetHistory.bind(this);
  }

  state = {
    history: [],
  }
  
  render() {
    const { selectedJob } = this.props;
    let startTime = selectedJob['startTime'];
    let endTime = selectedJob['endTime'];
    return (
      
      <div>
        <Typography variant="h5" component="h5">
          <b>Handset History</b>
          <br/>
                   
        </Typography>  
        {/*<HandsetHistoryGraph1 data={this.state.history}/> */}
        <HandsetHistoryGraph data={this.state.history} />
        <HandsetHistoryTable data={this.state.history} />
        
      </div>
    );
  }

  async componentDidMount() {
    await this.fetchHandsetHistory();
  }

  async fetchHandsetHistory() {
    const { selectedJob } = this.props;
    try {
      let response = await getHandsetHistory(selectedJob['id']);
      this.setState({ history: response });
    } catch (error) {
      console.log(error);
    }
  }
}

export default withStyles(styles)(HandsetHistory);
