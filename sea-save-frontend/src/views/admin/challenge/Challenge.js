import React, {useEffect, useState} from 'react';
import {useTheme} from "@mui/material/styles";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "@mui/lab/TabPanel";
import CreateChallenge from "./CreateChallenge";
import ChallengeTable from "./ChallengeTable";
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";

const Challenge = () => {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [challengesList, setChallengesList] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        console.log("//start load user data ")
        getAllChallenges();

    }, [])
    const getAllChallenges = async () => {
        await axios.get(`${BASE_URL}challenge/`)
            .then(response => {
                console.log("Challenges GET : ", response.data)

                setChallengesList(response.data);
                setRows(response.data);
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

    return (
        <TabContext value={value} >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="primary"
                         indicatorColor="primary">
                    <Tab label="All Challenges" {...a11yProps(1)} />
                    <Tab label="Create Challenge" {...a11yProps(2)} />
                </TabList>
            </Box>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <ChallengeTable rows={rows} challengesList={challengesList} setChallengesList={setChallengesList} setRows={setRows} getAllChallenges={() => getAllChallenges()}/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <CreateChallenge getAllChallenges={() => getAllChallenges()}/>
                </TabPanel>
            </SwipeableViews>
        </TabContext>
    );
};

export default Challenge;
