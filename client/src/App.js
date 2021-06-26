import React, { Component } from "react";
import "./css/App.css";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Signup from "./components/Signup/Signup";
import AuthRoute from "./router/AuthRoute";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Sky from "react-sky";
import ml1 from "./background-images/ml1.png";
import ml2 from "./background-images/ml2.png";
import ml3 from "./background-images/ml3.png";
import ml4 from "./background-images/ml4.png";
import ml5 from "./background-images/ml5.png";
import ml6 from "./background-images/ml6.png";
import ml7 from "./background-images/ml7.png";
import ml8 from "./background-images/ml8.png";
import ml9 from "./background-images/ml9.png";
import ml10 from "./background-images/ml10.png";
import Faq from "./components/Faq/Faq";
import Landing from "./components/Landing";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      light: "#81c784",
      main: "#4caf50",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#aa647b",
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Sky
          images={{
            0: ml1,
            1: ml2,
            2: ml3,
            3: ml4,
            4: ml5,
            5: ml6,
            6: ml7,
            7: ml8,
            8: ml9,
            9: ml10,
          }}
          how={
            60
          } /* Pass the number of images Sky will render chosing randomly */
          time={40} /* time of animation */
          size={"60px"} /* size of the rendered images */
          background={"palettedvioletred"} /* color of background */
        />
        <div className="root">
          <Router>
            <Switch>
              <AuthRoute
                path="/home"
                type="private"
                render={(props) => (
                  <Navigation {...props.history.location.state} />
                )}
              ></AuthRoute>
              <AuthRoute path="/faq">
                <Faq />
              </AuthRoute>
              {/* <AuthRoute path="/login" type="guest">
            <LoginPage />
          </AuthRoute> */}
              {/* <AuthRoute path="/my-account" type="private">
            <MyAccount />
          </AuthRoute> */}

              <AuthRoute path="/signup" type="guest">
                <Signup />
              </AuthRoute>
              <AuthRoute path="/signin" type="guest">
                <Signin />
              </AuthRoute>

              <AuthRoute path="/" type="guest">
                <Landing />
              </AuthRoute>
              {/* <Route path="/" render={Signin} /> */}
            </Switch>
          </Router>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
