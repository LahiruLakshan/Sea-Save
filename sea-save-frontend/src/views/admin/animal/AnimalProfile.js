import React, {useEffect, useState} from 'react';
import {useTheme} from "@mui/material/styles";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "@mui/lab/TabPanel";
import CreateAnimalProfile from "./CreateAnimalProfile";
import AnimalProfileTable from "./AnimalProfileTable";
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";

const AnimalProfile = () => {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [animalsList, setAnimalsList] = useState([]);

    useEffect(() => {
        console.log("//start load user data ")
        getAllAnimals();

    }, [])
    const getAllAnimals = async () => {
        await axios.get(`${BASE_URL}animal/`)
            .then(response => {
                console.log("animal GET : ", response.data)

                setAnimalsList(response.data);
                setRows(response.data);
            })
    }

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

    return (
        <TabContext value={value} >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="primary"
                         indicatorColor="primary">
                    <Tab label="All Animals" {...a11yProps(1)} />
                    <Tab label="Create Animal Profile" {...a11yProps(2)} />
                </TabList>
            </Box>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <AnimalProfileTable rows={rows} animalsList={animalsList} setAnimalsList={setAnimalsList} setRows={setRows} getAllAnimals={() => getAllAnimals()}/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <CreateAnimalProfile getAllAnimals={() => getAllAnimals()}/>
                </TabPanel>
            </SwipeableViews>
        </TabContext>
    );
};

export default AnimalProfile;
