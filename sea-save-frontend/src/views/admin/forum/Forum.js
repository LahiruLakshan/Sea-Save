import React, {useEffect, useState} from 'react';
import {useTheme} from "@mui/material/styles";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "@mui/lab/TabPanel";
import CreateForum from "./CreateForum";
import ForumTable from "./ForumTable";
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";

const Forum = ({name}) => {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [forumList, setForumList] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        console.log("//start load user data ")
        getAllForums();
    }, [])

    const getAllForums = async () => {
        await axios.get(`${BASE_URL}forum/`)
            .then(response => {
                console.log("forum GET : ", response.data)
                setForumList(response.data);
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
                    <Tab label="All Solutions" {...a11yProps(1)} />
                    {/*<Tab label="Create Solutions" {...a11yProps(2)} />*/}
                </TabList>
            </Box>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <ForumTable rows={rows} forumList={forumList} setForumList={setForumList} setRows={setRows} getAllForums={() => getAllForums()} name={name}/>
                </TabPanel>
                {/*<TabPanel value={value} index={1} dir={theme.direction}>*/}
                {/*    <CreateForum name={name}/>*/}
                {/*</TabPanel>*/}
            </SwipeableViews>
        </TabContext>
    );
};

export default Forum;
