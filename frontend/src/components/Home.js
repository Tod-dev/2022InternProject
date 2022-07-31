import React, { useState } from "react";

import StyledLink from "./StyledLink";

import GlobalContext from "./context/globalContext";

const Home = () => {
  const [fileBase64, setFileBase64] = useState(""); //C:\fakepath\TeseoTech.txt
  const { backendService } = React.useContext(GlobalContext);

  const importFile = async (event) => {
    event.preventDefault();
    console.log(fileBase64);
    const file = document.querySelector("#fileBase64").files[0];
    let dataInBase64 = await toBase64(file);
    dataInBase64 = dataInBase64.split(",")[1];
    console.log("BASE64: ", dataInBase64);
    // creates entity
    fetch(`${backendService}/importDataFromFile`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        fileBase64: dataInBase64,
      }),
    })
      .then((response) => {
        console.log(response);
        alert("INSERIMENTO EFFETTUATO!!!");
      })
      .catch((err) => {
        console.log(err);
        alert("ERRORE NELL'INSERIMENTO!!!");
      });
  };

  return (
    <div className="App">
      <div className="App-header">
        <p>
          <StyledLink to="/data">Processed Data</StyledLink>
        </p>

        <label for="fileBase64">
          Importa il file di testo da essere processato:
        </label>
        <input
          type="file"
          id="fileBase64"
          name="fileBase64"
          accept=".txt"
          onChange={(e) => setFileBase64(e.target.value)}
        />
        {fileBase64 && (
          <button
            type="submit"
            className="button-home"
            variant="primary"
            onClick={importFile}
          >
            Go
          </button>
        )}
      </div>
    </div>
  );
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default Home;
