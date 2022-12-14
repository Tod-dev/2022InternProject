import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import GlobalContext from "./context/globalContext";

import Home from "./components/Home";
import Data from "./components/data";
import DefaultEndpoint from "./components/defaultEndpoint";

const App = () => {
  const globalState = {
    backendService: "http://localhost:3001",
  };

  return (
    <GlobalContext.Provider value={globalState}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/data" element={<Data />} />
          <Route path="*" element={<DefaultEndpoint />} />
        </Routes>
      </Router>
    </GlobalContext.Provider>
  );
};

export default App;
