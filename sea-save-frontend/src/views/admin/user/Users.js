import * as React from 'react';
import {useEffect} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {useTheme} from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import ApprovedUsersTable from "./ApprovedUsersTable";
import PendingUsersTable from "./PendingUsersTable";
import {auth} from "../../../firebase";

const Users = ({role}) => {

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
                    {value === 0 && <PendingUsersTable role={role}/>}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {value === 1 && <ApprovedUsersTable role={role}/>}
                </TabPanel>
            </SwipeableViews>
        </TabContext>
    );
};

export default Users;
