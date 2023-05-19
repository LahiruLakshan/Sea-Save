import React, {useEffect, useState} from 'react';
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import {useTheme} from "@mui/material/styles";
import axios from "axios";
import {BASE_URL} from "../../config/defaults";
import {Grid} from "@mui/material";
import ChallengeCard from "../admin/challenge/ChallengeCard";
import AnimalCard from "../admin/animal/AnimalCard";
import CustomFooter from "../../components/CustomFooter";

const AnimalProfileView = ({name, profileId}) => {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [challengesList, setChallengesList] = useState([]);
    const [solutionsList, setSolutionsList] = useState([]);
    const [animalsList, setAnimalsList] = useState([]);
    const [showFooter, setShowFooter] = useState(false); // State to control the visibility of the footer

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFooter(true); // Show the footer after 1 second
        }, 1000);

        return () => {
            clearTimeout(timer); // Clear the timer if the component unmounts before the 1-second delay
        };
    }, []);

    return (
        <div>
            <ResponsiveAppBar/>
            <Grid container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2} paddingY={2}>
                {
                    animalsList?.map((value) => {
                        return(
                            <Grid item>
                                <AnimalCard data={value}/>
                            </Grid>
                        );
                    })
                }
            </Grid>
            {showFooter && <CustomFooter />}
        </div>
    );
};

export default AnimalProfileView;
