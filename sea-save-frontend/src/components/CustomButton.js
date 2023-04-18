import React from 'react';
import {Button} from "@mui/material";
import {Link} from "react-router-dom";

const CustomButton = (props) => {
    const {text,to, type, onClick} = props;
    return (
        <Button type={type} onClick={onClick } component={Link} to={to} variant={"contained"} color={"primary"} sx={{width: "100%"}}>{text}</Button>
    );
};

export default CustomButton;