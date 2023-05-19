import React from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme) => {
    return {
        appBar: {
            transform: "translateZ(500px)",
            boxShadow: "none",
            transition: " 0.5s ease",
        },
        setAppBar: {
            boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
            transform: "translateZ(-500px)",
            // background:"rgba(255,255,255,0.2)",
            // filter:"blur(4px)",
            // background: "linear-gradient(-90deg, rgba(66,8,166,1) 0%, rgba(0,45,146,1) 100%)",
            // backdropFilter: "blur(4px)",
            transition: " 0.5s ease",
        },
        text:{
            color: "#000000"
        },
        setText:{
            color: "#ffffff"
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            minHeight: '100px',
            ...theme.mixins.toolbar,
        },
        footer: {
            position: "relative",
            left: 0,
            bottom: 0,
            width: "100%",
            textAlign: "center",
        },
        bodyCus: {
            minHeight: "80vh"
        }
    }
})

const CustomFooter = () => {
    const classes = useStyles()
    return (
        <Box component="main" sx={{flexGrow: 1, p: 5, bgcolor:"#5AC6FF"}}>
            <div className={classes.footer}>
                <Typography variant="body2" color="textSecondary" align="center">Copyright © 2022. All rights reserved by Sea Save</Typography>
            </div>
        </Box>
    );
};

export default CustomFooter;
