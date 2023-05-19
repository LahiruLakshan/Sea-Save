import React, {useEffect, useState} from 'react';
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import {useTheme} from "@mui/material/styles";
import axios from "axios";
import {BASE_URL} from "../../config/defaults";
import {Grid} from "@mui/material";
import ChallengeCard from "../admin/challenge/ChallengeCard";
import CustomFooter from "../../components/footer/CustomFooter";

const ChallengeView = ({name, profileId}) => {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [challengesList, setChallengesList] = useState([]);
    const [solutionsList, setSolutionsList] = useState([]);
    const [showFooter, setShowFooter] = useState(false); // State to control the visibility of the footer

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        getAllChallenges();
        getAllSolutions();

    }, [])
    const getAllChallenges = async () => {
        await axios.get(`${BASE_URL}challenge/`)
            .then(response => {
                console.log("Challenges GET : ", response.data)

                setChallengesList(response.data);
                setRows(response.data);
            })
    }



    useEffect(() => {
        console.log("//start load user data ")
        getAllSolutions();

    }, [])
    const getAllSolutions = async () => {
        await axios.get(`${BASE_URL}forum/`)
            .then(response => {
                console.log("Forum GET : ", response.data)
                setSolutionsList(response.data);
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
                    challengesList?.map((value) => {
                        const solutions = solutionsList?.filter((item) => item?.challengeId === value?._id)
                        console.log("Filted Solution : ", solutions)
                        return(
                            <Grid item>
                                <ChallengeCard data={value} solutions={solutions} name={name} profileId={profileId} getAllSolutions={() => getAllSolutions()} getAllChallenges={() => getAllChallenges()}/>
                            </Grid>
                        );
                    })
                }
            </Grid>
            {showFooter && <CustomFooter />}
        </div>
    );
};

export default ChallengeView;
