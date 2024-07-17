import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
// Local
import theme from "./theme";
import SignIn from "./pages/SignIn";
import Landing from "./pages/Landing";
import AdminOT from "./pages/AdminOT";
import CaseOT from "./pages/CaseOT";
// import CheckOT from "./pages/CheckOT";
// import FencingOT from "./pages/FencingOT";

class App extends React.PureComponent {
  render() {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route path="/" exact component={SignIn} />

            <Route path="/landing" exact component={Landing} />
            <Route path="/admin" exact component={AdminOT} />
            <Route path="/case" exact component={CaseOT} />
            {/* <Route path="/check" exact component={CheckOT} /> */}
            {/* <Route path='/fence' exact component={FencingOT} /> */}
          </Switch>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
