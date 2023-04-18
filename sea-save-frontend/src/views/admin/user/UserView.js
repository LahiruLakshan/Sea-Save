import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {auth, db, storage} from "../../../firebase";
import {useSnackbar} from "notistack";
import Typography from "@mui/material/Typography";
import {addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc} from "firebase/firestore";
import 'moment-timezone';
import {getAuth, deleteUser} from "firebase/auth";

const UserView = (props) => {
    const {rowData, role} = props;
    const {enqueueSnackbar} = useSnackbar();

    const [loading, setLoading] = React.useState(false);
    const [ranking, setRanking] = useState(rowData.adminApproval ? rowData.ranking : "");
    const [level, setLevel] = useState(rowData.adminApproval ? rowData.level : 1);
    const [userRole, setUserRole] = useState(rowData.adminApproval ? rowData.role:"");

    const submitDetails = async () => {
        setLoading(true);

        //validations
        if (ranking === "") {
            enqueueSnackbar("Rank empty!", {variant: "error"});
            setLoading(false);
        } else {
            const payload = {ranking, level, "adminApproval": true, "approvedDateTime": new Date(), "role":userRole};
            const docRef = doc(db, "user", rowData.id)
            await updateDoc(docRef, payload).then(() => {
                enqueueSnackbar("User approval successfully!", {variant: "success"});
            })
            setLoading(false);
        }


    }

    const updateDetails = async () => {
        setLoading(true);
        if (rowData.ranking !== ranking || rowData.role !== userRole) {
            const payload = {ranking, level, "role":userRole};
            const docRef = doc(db, "user", rowData.id)
            await updateDoc(docRef, payload).then(() => {
                enqueueSnackbar("Updated the user ranking!", {variant: "success"});
            })
            setLoading(false);
        } else {
            enqueueSnackbar("Already updated!", {variant: "warning"});
            setLoading(false);
        }

    }

    const removeDetails = async () => {
        console.log(auth.currentUser.uid);

        const docRef = doc(db, "user", rowData.id)
        await deleteDoc(docRef)
            .then(() => {
                console.log('Successfully deleted user');
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
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

                    <Grid container item direction={"row"} justifyContent="center">
                        <Typography variant={"h6"}>User Details</Typography>
                    </Grid>
                    <Grid container item direction={"row"} justifyContent="center">
                        <Avatar src={rowData.profileUrl} sx={{width: 150, height: 150}}
                                onClick={() => window.open(rowData.profileUrl, "_blank")}/>
                    </Grid>
                    <Grid container item direction={"row"} justifyContent="space-between">
                        {/* -----------------------User Name---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <Typography variant={"caption"}>User Name</Typography>
                            <Typography variant={"inherit"}>{rowData.username}</Typography>
                        </Grid>
                        {/* -----------------------Name---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <Typography variant={"caption"}>Name</Typography>
                            <Typography variant={"inherit"}>{rowData.name}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container item direction={"row"} justifyContent="space-between">
                        {/* -----------------------Email---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <Typography variant={"caption"}>Email</Typography>
                            <Typography variant={"inherit"}>{rowData.email}</Typography>
                        </Grid>
                        {/* -----------------------Mobile No---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <Typography variant={"caption"}>Mobile Number</Typography>
                            <Typography variant={"inherit"}>{rowData.mobileNo}</Typography>
                        </Grid>
                    </Grid>

                    {rowData.adminApproval && <Grid container item direction={"row"} justifyContent="space-between">
                        {/* -----------------------Ranking---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <Typography variant={"caption"}>Ranking</Typography>
                            <Typography variant={"inherit"}>{rowData.ranking}</Typography>
                        </Grid>
                    </Grid>}


                    <Grid container item direction={"row"} justifyContent="center" pt={10}>
                        <Typography variant={"h6"}>Vehicle Details</Typography>
                    </Grid>
                    <Grid container item direction={"row"} justifyContent="center">
                        <Avatar src={rowData.vehicleUrl} sx={{width: 150, height: 150}}
                                onClick={() => window.open(rowData.vehicleUrl, "_blank")}/>
                    </Grid>
                    <Grid container item direction={"row"} justifyContent="space-between">
                        {/* -----------------------vehicle brand---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <Typography variant={"caption"}>Vehicle Brand</Typography>
                            <Typography variant={"inherit"}>{rowData.vehicleBrand}</Typography>
                        </Grid>
                        {/* -----------------------vehicle model---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <Typography variant={"caption"}>Vehicle Model</Typography>
                            <Typography variant={"inherit"}>{rowData.vehicleModel}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container item direction={"row"} justifyContent="space-between">
                        {/* -----------------------Vehicle year---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <Typography variant={"caption"}>Vehicle Year</Typography>
                            <Typography variant={"inherit"}>{rowData.vehicleYear}</Typography>
                        </Grid>
                        {/* -----------------------vehicle Color---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <Typography variant={"caption"}>Vehicle Color</Typography>
                            <Typography variant={"inherit"}>{rowData.vehicleColor}</Typography>
                        </Grid>
                    </Grid>


                    {/* -----------------------Rank---------------------------- */}
                     <Grid container item direction={"row"} justifyContent="space-between">
                         <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <FormControl margin="dense" xs={5.5}>
                                <InputLabel id="demo-simple-select-label">Rank</InputLabel>
                                <Select sx={{width: "100%", minWidth: "300px", borderRadius: "10px"}} variant="outlined"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={ranking}
                                        label="Rank"
                                        onChange={(e) => {
                                            setRanking(e.target.value);

                                            if (e.target.value === "Newbee") setLevel(1);
                                            if (e.target.value === "Intermediate") setLevel(2);
                                            if (e.target.value === "Advance") setLevel(3);
                                            if (e.target.value === "Explorer") setLevel(4);
                                            if (e.target.value === "Marshall") setLevel(5);
                                            setUserRole(e.target.value === "Marshall" ? "Admin" : "User");
                                            console.log("Level : ", level)
                                        }}
                                >

                                    <MenuItem key={1} value={"Newbee"}>Newbee</MenuItem>
                                    <MenuItem key={2} value={"Intermediate"}>Intermediate</MenuItem>
                                    <MenuItem key={3} value={"Advance"}>Advance</MenuItem>
                                    <MenuItem key={4} value={"Explorer"}>Explorer</MenuItem>
                                    {role === "Super Admin" && <MenuItem key={5} value={"Marshall"}>Marshall</MenuItem>}
                                </Select>
                            </FormControl>
                        </Grid>


                        {/* -----------------------Role---------------------------- */}

                        {rowData.adminApproval && role === "Super Admin" && ranking === "Marshall" &&
                            <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                                <FormControl margin="dense" xs={5.5}>
                                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                    <Select sx={{width: "100%", minWidth: "300px", borderRadius: "10px"}}
                                            variant="outlined"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={userRole}
                                            label="Rank"
                                            onChange={(e) => {
                                                setUserRole(e.target.value);
                                            }}
                                    >

                                        <MenuItem key={1} value={"Admin"}>Admin</MenuItem>
                                        <MenuItem key={2} value={"Super Admin"}>Super Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>}
                    </Grid>
                    {/* -----------------------Buttons---------------------------- */}
                    {rowData.adminApproval ?
                        rowData.id !== auth.currentUser.uid &&
                        <Grid container item direction={"row"} justifyContent="flex-end" sx={{paddingTop: "30px"}}>
                            {/* -----------------------Update Button---------------------------- */}
                            <LoadingButton loading={loading} variant={"contained"} color={"primary"}
                                           sx={{
                                               minWidth: "200px",
                                               height: "50px",
                                               borderRadius: "10px",
                                               marginRight: "20px",
                                               backgroundColor: "#0dbd00"
                                           }}
                                           onClick={() => updateDetails()}>Update</LoadingButton>
                        </Grid>
                        :
                        <Grid container item direction={"row"} justifyContent="flex-end" sx={{paddingTop: "30px"}}>
                            {/* -----------------------Accept Button---------------------------- */}
                            <LoadingButton loading={loading} variant={"contained"} color={"primary"}
                                           sx={{
                                               minWidth: "200px",
                                               height: "50px",
                                               borderRadius: "10px",
                                               marginRight: "20px",
                                               backgroundColor: "#0dbd00"
                                           }}
                                           onClick={() => submitDetails()}>Accept</LoadingButton>
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
                    }


                </form>
            </Grid>

        </Box>
    );
};

export default UserView;
