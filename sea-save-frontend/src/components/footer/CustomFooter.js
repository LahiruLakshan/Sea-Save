/* eslint-disable */
import React from 'react';

import "./footer.css";
import {makeStyles} from "@mui/styles";
import Logo from "../../assets/images/sea-save-logo.png";
import {Grid} from "@mui/material";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: "#0265A9",
        minHeight: "15vh",
        textAlign: 'center',
        color: theme.palette.text.primary,
    },
    paper: {
        minHeight: "15vh",
        // padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: "transparent",
        // boxShadow:"none",
        // margin: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    row1: {
        padding: "5vh 0",
        // border:"1px solid #123456"
    },
    navBtn: {
        margin: "1px"
    },
    contact:{
        [theme.breakpoints.down("md")]: {
            marginTop:"25px"
        }
    },
    footer: {
        position: "relative",
        left: 0,
        bottom: 0,
        width: "100%",
        textAlign: "center",
        color:"#8ADDFF"
    },
    contactUs: {
        // margin: "10px",
        textAlign: "left",
        [theme.breakpoints.only("md")]: {
            display: "flex",
            direction: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            // margin: "20px"
        },
        [theme.breakpoints.only("sm")]: {
            display: "flex",
            direction: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            // margin: "20px"
        }

        // backgroundColor:"#123456",
        // display:"flex",
        // direction:"column",
        // alignItems: "flex-start",
        // justifyContent: "flex-start",
    }

}));


function CustomFooter(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid container direction="row" justify="center" alignItems={"flex-start"} className={classes.row1}

            >
                {/*<Paper className={classes.paper}>*/}
                <Grid container direction="column" justify={"center"} alignItems={"center"} item lg={6} md={12} sm={12}
                      xs={12}
                      data-aos="fade-up"
                    // data-aos-offset="200"
                    //   data-aos-delay="1000"
                      data-aos-duration="1000"
                >
                    {/*<div className="footer-left">*/}

                    {/*<div><Logo/></div>*/}
                    {/*<p className="footer-company-about">*/}
                    <Typography variant={"h4"} sx={{color:"#8ADDFF"}}>
                        Follow us social media
                    </Typography>
                    {/*</p>*/}
                    <ul className="social-icons">
                        <li><a  href="https://www.facebook.com/profile.php?id=100090418007548&mibextid=ZbWKwL" target="_blank" className="social-icon">
                            <i className="fa fa-facebook fa-2x"></i></a>
                        </li>
                        <li><a href="" target="_blank" className="social-icon">
                            <i  className="fa fa-twitter-square fa-2x"></i></a>
                        </li>
                        <li><a href="" target="_blank"
                               className="social-icon">
                            <i  className="fa fa-instagram fa-2x"></i></a>
                        </li>
                        <li><a href="" target="_blank" className="social-icon">
                            <i  className="fa fa-youtube-play fa-2x"></i></a>
                        </li>
                    </ul>
                </Grid>



                <Grid container direction="column" justify="flex-start" alignItems={"center"} item lg={6} md={12}
                      sm={12} xs={12} className={classes.contact}
                      data-aos="fade-up"
                    // data-aos-offset="200"
                    //   data-aos-delay="1000"
                      data-aos-duration="1000"
                >
                    <Typography variant={"h4"} sx={{color:"#8ADDFF"}}>
                        Contact Us
                    </Typography>
                    <ul className="social-icons">
                        <li><a  href="https://www.facebook.com/CODEX.TECH.HOUSE" target="_blank" className="social-icon">
                            <i className="fa fa-map-marker fa-2x" aria-hidden="true"></i></a>
                        </li>
                        <li><a href="https://www.youtube.com/channel/UCYAvumOO9vdaw0HqRVBS6yA" target="_blank" className="social-icon">
                            <i  className="fa fa-envelope fa-2x" aria-hidden="true"></i></a>
                        </li>
                        <li><a href="https://www.linkedin.com/company/teamcodex" target="_blank"
                               className="social-icon">
                            <i  className="fa fa-phone fa-2x" aria-hidden="true"></i></a>
                        </li>

                    </ul>
                </Grid>
                <div className={classes.footer}>
                    <Typography variant="body2" align="center">Copyright © 2022. All rights reserved by Sea Save</Typography>
                </div>
                {/*</Paper>*/}
            </Grid>
        </div>
    );
}

export default CustomFooter;
