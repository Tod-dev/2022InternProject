import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Data from "./components/data";
import DefaultEndpoint from "./components/defaultEndpoint";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/data" element={<Data />} />
        <Route path="*" element={<DefaultEndpoint />} />
      </Routes>
    </Router>
  );
};

export default App;
