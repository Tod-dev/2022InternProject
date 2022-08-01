import React from "react";

import StyledLink from "./StyledLink";
import GlobalContext from "../context/globalContext";

const Data = () => {
  const { backendService } = React.useContext(GlobalContext);

  //from, limit
  const [from, setFrom] = React.useState("");
  const [limit, setLimit] = React.useState("");
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    //effect;
    let queryParams = "?";
    let containsParams = false;
    console.log("from:", from);
    if (from && !isNaN(from)) {
      queryParams += `from=${from}`;
      containsParams = true;
      console.log("from:", from);
    }
    if (limit && !isNaN(limit)) {
      if (containsParams) queryParams += "&";
      queryParams += `limit=${limit}`;
      containsParams = true;
    }
    let url = `${backendService}/data${containsParams ? queryParams : ""}`;
    console.log("URL:", url);
    fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        //alert("done!!!");
        setData(response);
      })
      .catch((err) => {
        console.log(err);
        console.log("ERRORE NEL fetch !!!");
        setError(true);
      });
    return () => {
      //cleanup;
    };
  }, [from, limit, backendService]);

  return (
    <div className="App">
      <div className="App-header">
        <p>
          <StyledLink to="/" style={{ textDecoration: "none" }}>
            Home
          </StyledLink>
        </p>
        <p>
          <input
            type="number"
            id="from"
            name="from"
            min="1"
            placeholder="From"
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            type="number"
            id="limit"
            name="limit"
            min="1"
            placeholder="Limit"
            onChange={(e) => setLimit(e.target.value)}
          />
        </p>
        {!error && (
          <table id="dati">
            <thead>
              <tr>
                <th>K</th>
                <th>D</th>
                <th>timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => {
                return (
                  <tr key={d.id}>
                    <td>{d.k}</td>
                    <td>{d.d}</td>
                    <td>{d.dataora}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {error && <p style={{ color: "red" }}>Server unreachable!</p>}
      </div>
    </div>
  );
};

export default Data;
