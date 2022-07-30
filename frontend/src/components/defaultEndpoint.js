import React from "react";

import StyledLink from "./StyledLink";

const DefaultEndpoint = () => {
  return (
    <div className="App">
      <div className="App-header">
        <p>
          <StyledLink to="/">Home</StyledLink>
        </p>
      </div>
    </div>
  );
};

export default DefaultEndpoint;
