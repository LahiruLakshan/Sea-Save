import React from 'react';
import {Link} from 'react-router-dom';
import {AppBar, Button} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import ResponsiveAppBar from "../../components/ResponsiveAppBar";

const Home = () => {
    return (
        <>
            <ResponsiveAppBar/>
            <div>
                    Home
            </div>
        </>
    );
};

export default Home;
