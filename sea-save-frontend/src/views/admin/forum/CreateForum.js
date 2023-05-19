import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import {getDoc, collection, doc, onSnapshot, query, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from "../../../firebase";
import {Box, Grid, Paper, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";
import moment from "moment";

const CreateForum = (props) => {

    const {rowData, onClose, name, challengeId, profileId, getAllForums, getAllSolutions} = props;
    const [loading, setLoading] = React.useState(false);
    const [title, setTitle] = useState(rowData ? rowData.title : "");
    const [description, setDescription] = useState(rowData ? rowData.solution : "");
    const [changes, setChanges] = React.useState(false);
    // const [challengeIdValue, setChallengeIdValue] = React.useState(challengeId);

    const {enqueueSnackbar} = useSnackbar();

    const submitDetails = async (e) => {
        e.preventDefault();
        setLoading(true);


       if (description === ""){
            enqueueSnackbar("Solution Empty!", {variant: "error"});
        }
        else if (!changes){
            enqueueSnackbar("No Changes!", {variant: "warning"});
        }
        // else if (rowData) {
        //     console.log("row data", rowData)
        //     console.log("row data", rowData)
        //     let payload = {title, description, lastUpdated: name};
        //     const docRef = doc(db, "forum", rowData.id)
        //     await updateDoc(docRef, payload).then(() => {
        //         enqueueSnackbar("Updated rule and forum!", {variant: "success"});
        //         setTitle("")
        //         setDescription("")
        //         setLoading(false);
        //         setChanges(false)
        //         onClose();
        //     })
        //
        // }
        else {
           if (rowData){
               console.log("rowData : ", rowData)

               console.log("time : ", moment(new Date()).format('MMMM Do YYYY, h:mm a').trim())
               const formData = {
                   profileId: rowData.profileId.trim(),
                   challengeId: rowData.challengeId.trim(),
                   name: name,
                   solution: description.trim(),
                   time: moment(new Date()).format('MMMM Do YYYY, h:mm a').trim()
               }


               await axios.put(`${BASE_URL}forum/update/${rowData._id}`, formData)
                   .then((res) => {
                       console.log("Forum create RES : ", res)
                       enqueueSnackbar("Done", {variant: "success"});
                       setTitle("")
                       setDescription("")
                       getAllForums()
                       onClose()
                   }).catch((err) => {
                       console.log("Forum create ERRor : ", err)
                   })
           } else {
               const formData = {
                   profileId: profileId.trim(),
                   challengeId: challengeId.trim(),
                   name: name,
                   solution: description.trim(),
                   time: moment(new Date()).format('MMMM Do YYYY, h:mm a').trim()
               }

               await axios.post(`${BASE_URL}forum/create`, formData)
                   .then((res) => {
                       console.log("Forum create RES : ", res)
                       enqueueSnackbar("Done", {variant: "success"});
                       setTitle("")
                       setDescription("")
                       getAllSolutions();
                       onClose()
                   }).catch((err) => {
                       console.log("Forum create ERRor : ", err)
                   })
           }
            // let payload = {title, description, createdDateTime: new Date(), author: name, lastUpdated: ""};
            // const docRef = doc(db, "forum", "forum")
            // await setDoc(docRef, payload).then(() => {
            //     enqueueSnackbar("Rule and forum submitted!", {variant: "success"});
            //     setChanges(false)
            //     setLoading(false);
            //     setTitle("")
            //     setDescription("")
            //     setTitle("")
            // })
        }
        setLoading(false);
    };

    //start load user data
    // useEffect(() => {
    //
    //     const docRef = doc(db, "forum", "forum");
    //
    //     getDoc(docRef).then((doc) => {
    //         setTitle(doc.data().title)
    //         setDescription(doc.data().description)
    //         console.log("Snap", doc.data().description)
    //     })
    //
    //
    // }, [])
    return (
        <Box sx={{borderRadius: 0, justifyContent: "center", alignItems: "center", display: "flex"}}>
            <Grid container justifyContent="space-around" component={!rowData && Paper}
                  item lg={5.9} md={6} sm={12} xs={12} direction={"column"}
                  sx={{
                      // background: "#FBFBFB",
                      borderRadius: "10px",
                      padding: rowData ? "0 50px" : "50px",
                      minWidth: "500px"
                  }}>
                <form onSubmit={submitDetails}>

                    <Grid container direction={"column"}>
                        {/*/!* ------------------Title--------------------- *!/*/}
                        {/*<Grid container item direction={"column"}>*/}
                        {/*    <Grid item sx={{paddingTop: "20px"}}>*/}
                        {/*        /!*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*!/*/}
                        {/*        <Grid item sx={{}}>*/}
                        {/*            <TextField margin="dense" id="outlined-basic"*/}
                        {/*                       fullWidth*/}
                        {/*                       sx={{width: "100%", minWidth: "150px"}}*/}
                        {/*                       variant="outlined" label={"Forum Title"}*/}
                        {/*                       value={title}*/}
                        {/*                       onChange={(e) => {*/}
                        {/*                           setChanges(true);*/}
                        {/*                           setTitle(e.target.value);*/}
                        {/*                       }}/>*/}
                        {/*            /!*<CustomTextField/>*!/*/}
                        {/*        </Grid>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}

                        {/* -----------------------Solution---------------------------- */}

                        <Grid container item direction={"column"}>
                            <Grid item sx={{paddingTop: "20px"}}>
                                {/*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*/}
                                <Grid item sx={{}}>
                                    <TextField margin="dense" id="outlined-basic"
                                               fullWidth
                                               sx={{width: "100%", minWidth: "150px"}}
                                               variant="outlined" label={"Solution"}
                                               placeholder={"Write Solution..."}
                                               value={description}
                                               multiline
                                        // minRows={7}
                                               rows={15}
                                               onChange={(e) => {
                                                   setChanges(true);
                                                   setDescription(e.target.value);
                                               }}/>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid sx={{paddingTop: "30px"}}>
                        <LoadingButton type="submit" loading={loading} variant={"contained"} color={"primary"}
                                       sx={{width: "100%", height: "50px", borderRadius: "10px"}}
                        >Submit</LoadingButton>
                    </Grid>
                </form>
            </Grid>

        </Box>
    );
};

export default CreateForum;
