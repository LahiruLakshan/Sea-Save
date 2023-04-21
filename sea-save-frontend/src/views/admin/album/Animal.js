import React, {useEffect} from 'react';
import {useTheme} from "@mui/material/styles";
import {auth} from "../../../firebase";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "@mui/lab/TabPanel";
import AlbumsTable from "./AlbumsTable";

const Animal = ({role}) => {

    const [value, setValue] = React.useState(0);
    const theme = useTheme();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    useEffect(() =>{
        console.log("auth.currentUser : ", auth.currentUser.email)
    },[])

    return (
        <TabContext value={value} >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="primary"
                         indicatorColor="primary">
                    {/*<Tab label="Gallery" {...a11yProps(0)} />*/}
                    <Tab label="Pending" {...a11yProps(0)} />
                    <Tab label="Approved" {...a11yProps(1)} />
                </TabList>
            </Box>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    {value === 0 && <AlbumsTable role={role} status={false}/>}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {value === 1 && <AlbumsTable role={role} status={true}/>}
                </TabPanel>
            </SwipeableViews>
        </TabContext>
    );
};

export default Animal;
