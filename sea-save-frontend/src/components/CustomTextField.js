import React from 'react';
import {TextField} from "@mui/material";

const CustomTextField = (props) => {
    const {handleInputChange, handleInput, defaultValue, type} = props;
    return (
        <TextField margin="dense" id="outlined-basic" color={"secondary"} type={type}
                   defaultValue={defaultValue}
                   onChange={(e) => {
                       handleInputChange(handleInput, e.target.value)
                   }}
                   sx={{width: "100%"}}
                   variant="outlined"/>
    );
};

export default CustomTextField;
