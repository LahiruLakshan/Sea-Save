import React from 'react';
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";

const CustomIndicator = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress color="primary" />
        </Box>
    );
};

export default CustomIndicator;
