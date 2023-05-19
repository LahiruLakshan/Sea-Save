import React from 'react';
import {Link} from 'react-router-dom';
import {AppBar, Button} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import logo from "../../assets/images/se-save-home.jpg"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {makeStyles} from "@mui/styles";
import CustomFooter from "../../components/CustomFooter";



const Home = () => {

    return (
        <>
            <ResponsiveAppBar/>
            <div style={{
                backgroundImage: `url(${logo})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                height: '100vh', // Set the height of the container to cover the full viewport height
            }}
            >
            </div>
            <CustomFooter/>
        </>
    );
};

export default Home;
