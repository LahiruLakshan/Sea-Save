import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {UserContextProvider} from "./context/UserContext";
import {SnackbarProvider} from "notistack";
import theme from "./theme";
import {ThemeProvider} from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';

if (process.env.NODE_ENV !== "development") {
    console.log = () => {
    };
}

ReactDOM.render(
    // <React.StrictMode>
    <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
            <UserContextProvider>
                <App/>
            </UserContextProvider>
        </SnackbarProvider>
    </ThemeProvider>
    // </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
