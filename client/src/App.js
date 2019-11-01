import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route } from "react-router-dom";
import NavTabs from "./components/NavTabs";
import MixTapeHome from "./components/pages/MixTapeHome";

function App() {
  return (
    <Router>
      <div>
        <NavTabs />
        <Route exact path="/" component={MixTapeHome} />
      </div>
    </Router>
  );
}

export default App;
