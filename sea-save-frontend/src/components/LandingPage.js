import React from 'react';
import {Grid} from "@mui/material";
import logo from "../assets/svg/logo.svg";
import CustomIndicator from "./CustomIndicator";

const LandingPage = () => {
    return (
        <Grid container direction={"column"} justifyContent={"center"}
              alignItems="center" item
              sx={{
                  // backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover',
                  bgcolor:"#252525",
                  backgroundRepeat: 'no-repeat',
                  height:"100vh"
              }}
        >

            <Grid item align={"center"} sx={{}}>
                <img src={logo} style={{width:"300px"}}/>
            </Grid>
            <Grid item align={"center"} sx={{}} pt={5}>
                <CustomIndicator/>
            </Grid>
        </Grid>
    );
};

export default LandingPage;
