import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Homepage from "./Homepage.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route component={Login} path="/login" />
          <Route component={Signup} path="/signup" exact />
          <Route component={Homepage} path="/" exact />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
