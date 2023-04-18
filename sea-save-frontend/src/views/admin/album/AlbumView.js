import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {auth, db, storage} from "../../../firebase";
import {useSnackbar} from "notistack";
import Typography from "@mui/material/Typography";
import {addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc} from "firebase/firestore";
import 'moment-timezone';
import {Carousel} from 'react-bootstrap';
import styled from "styled-components";
import {getAuth, deleteUser} from "firebase/auth";

const Slide = styled.div`
  height: 70vh;
  flex-shrink: 0;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  transition: 750ms all ease-in-out;
`;


const AlbumView = (props) => {
    const {rowData, role} = props;
    const {enqueueSnackbar} = useSnackbar();

    const [loading, setLoading] = React.useState(false);

    const submitDetails = async () => {
        setLoading(true);


        const payload = {"isAdminApproved": true, "adminAlbumApprovedTime": new Date(),};
        const docRef = doc(db, "album", rowData.id)
        await updateDoc(docRef, payload).then(() => {
            enqueueSnackbar("Album approval successfully!", {variant: "success"});
        })
        setLoading(false);
    }

    const removeDetails = async () => {
        console.log(auth.currentUser.uid);

        const docRef = doc(db, "album", rowData.id)
        await deleteDoc(docRef).then(() => {
                enqueueSnackbar("Album Rejected!", {variant: "success"});
                console.log('Successfully deleted Album');
            })
            .catch((error) => {
                console.log('Error deleting Album:', error);
            });
    }
    useEffect(() => {
        console.log("Admin Role : ", role)
        console.log("User Role : ", rowData.role)
    }, [])

    return (
        <Box sx={{borderRadius: 0, justifyContent: "center", alignItems: "center", display: "flex"}}>
            <Grid container justifyContent="space-around"
                  item lg={9} md={10} sm={12} xs={12} direction={"column"}
                  sx={{
                      // background: "#FBFBFB",
                      borderRadius: "10px",
                      // padding: "10px",
                      marginBottom: "50px"
                  }}>
                <form action="#" method="post">

                    <Grid container item direction={"row"} justifyContent="space-between">
                        {/* -----------------------User Name---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={4}>
                            <Typography variant={"caption"}>User Name</Typography>
                            <Typography variant={"inherit"}>{rowData.username}</Typography>
                        </Grid>
                        {/* -----------------------Title---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={4}>
                            <Typography variant={"caption"}>Title</Typography>
                            <Typography variant={"inherit"}>{rowData.title}</Typography>
                        </Grid>
                        <Grid item sx={{paddingY: "20px"}} xs={4}>
                            <Typography variant={"caption"}>Album Length</Typography>
                            <Typography variant={"inherit"}>{rowData.album_images.length}</Typography>
                        </Grid>

                    </Grid>


                    <Carousel>
                        {
                            rowData.album_images.map((fileUrl) => (

                                <Carousel.Item key={fileUrl.id} interval={3000}>
                                    <Slide
                                        key={fileUrl.id}
                                        style={{
                                            backgroundImage: `url(${fileUrl})`,
                                        }}
                                    />
                                </Carousel.Item>

                            ))
                        }
                    </Carousel>


                    {/* -----------------------Buttons---------------------------- */}
                    <Grid container item direction={"row"} justifyContent="flex-end" sx={{paddingTop: "30px"}}>
                        {/* -----------------------Accept Button---------------------------- */}
                        {!rowData.isAdminApproved &&
                            <LoadingButton loading={loading} variant={"contained"} color={"primary"}
                                           sx={{
                                               minWidth: "200px",
                                               height: "50px",
                                               borderRadius: "10px",
                                               marginRight: "20px",
                                               backgroundColor: "#0dbd00"
                                           }}
                                           onClick={() => submitDetails()}>Accept</LoadingButton>
                        }
                        {/* -----------------------Reject Button---------------------------- */}
                        <LoadingButton loading={loading} variant={"contained"} color={"primary"}
                                       sx={{
                                           minWidth: "200px",
                                           height: "50px",
                                           borderRadius: "10px",
                                           backgroundColor: "#cc0000"
                                       }}
                                       onClick={() => removeDetails()}>Reject</LoadingButton>
                    </Grid>


                </form>
            </Grid>

        </Box>
    );
};

export default AlbumView;
