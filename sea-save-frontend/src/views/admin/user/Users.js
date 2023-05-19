import * as React from 'react';
import {useEffect, useState} from 'react';
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
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";

const Users = ({role}) => {

    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [pendingRows, setPendingRows] = useState([]);
    const [approvedRows, setApprovedRows] = useState([]);
    const [profileList, setProfileList] = useState([]);
    const [pendingProfileList, setPendingProfileList] = useState([]);
    const [approvedProfileList, setApprovedProfileList] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        console.log("//start load user data ")
        getAllProfiles();

    }, [])
    const getAllProfiles = async () => {
        await axios.get(`${BASE_URL}profile/`)
            .then(response => {
                console.log("profile GET : ", response.data)

                setProfileList(response.data);
                const approved = response.data.filter((value) => value?.adminApproval === true)
                const pending = response.data.filter((value) => value?.adminApproval === false)
                setApprovedProfileList(approved)
                setApprovedRows(approved)
                setPendingProfileList(pending)
                setPendingRows(pending)
                console.log("approved GET : ", approved)
                console.log("pending GET : ", pending)
                setRows(response.data)
            })
    }

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
                    <Tab label="Approved" {...a11yProps(0)} />
                    <Tab label="Pending" {...a11yProps(1)} />
                </TabList>
            </Box>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    {value === 0 && <PendingUsersTable role={role} rows={rows.filter((value) => value?.adminApproval === true)} profileList={profileList} setProfileList={setProfileList} setRows={setRows} getAllProfiles={() => getAllProfiles()}/>}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {value === 1 && <ApprovedUsersTable role={role} rows={rows.filter((value) => value?.adminApproval === false)} profileList={profileList} setProfileList={setProfileList} setRows={setRows} getAllProfiles={() => getAllProfiles()}/>}
                </TabPanel>
            </SwipeableViews>
        </TabContext>
    );
};

export default Users;
