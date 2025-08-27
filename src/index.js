import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import CreateContextProvider from "./component/Context/CreateContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CreateContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CreateContextProvider>
  </React.StrictMode>
);
