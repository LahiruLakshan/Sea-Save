import React, {useEffect, useRef, useState} from 'react';
import {Box, Grid, Paper, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {setDoc, addDoc, collection, doc, onSnapshot, query, updateDoc, where} from "firebase/firestore";
import {db, storage} from "../../../firebase";
import {useSnackbar} from "notistack";
import Autocomplete from '@mui/material/Autocomplete';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker, TimePicker} from "@mui/x-date-pickers";
import CustomUpload from "../../../components/CustomUpload";
import {uploadBytesResumable, ref, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";

const CreateDrive = (props) => {

    const {rowData, onClose} = props;
    const [loading, setLoading] = React.useState(false);
    const [title, setTitle] = useState(rowData ? rowData.title : "");
    const [description, setDescription] = useState(rowData ? rowData.description : "");
    const [meetingPoint, setMeetingPoint] = useState(rowData ? rowData.meetingPoint : "");
    // const [ruleRegulation, setRuleRegulation] = useState(rowData ? rowData.ruleRegulation : "");

    const [scheduleDate, setScheduleDate] = useState(rowData ? rowData.scheduleDateTime.toDate() : new Date());
    const [scheduleTime, setScheduleTime] = useState(rowData ? rowData.scheduleDateTime.toDate() : new Date());

    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState(rowData ? rowData.fileName : "");
    const [fileType, setFileType] = useState(rowData ? rowData.fileType : "");

    let fileRef = useRef(null);

    const {enqueueSnackbar} = useSnackbar();

    const handleDateChange = (newValue: Date | null) => {
        setScheduleDate(newValue);
    };

    const handleTimeChange = (newValue: Date | null) => {
        setScheduleTime(newValue);
    };

    const submitDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        const scheduleDateTime = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate(), scheduleTime.getHours(), scheduleTime.getMinutes());

        console.log("title: ", title);
        console.log("scheduleDateTime: ", scheduleDate);
        if (rowData) {
            console.log("rowData-scheduleDateTime: ", rowData.scheduleDateTime.toDate());
            console.log("rowData.fileName: ", rowData.fileName);
        }
        console.log("scheduleDateTime: ", !(scheduleDateTime > new Date()));


        if (title === "") {
            enqueueSnackbar("Title Name Empty!", {variant: "error"});
        } else if (description === "") {
            enqueueSnackbar("Description Empty!", {variant: "error"});
        } else if (meetingPoint === "") {
            enqueueSnackbar("Meeting Point Empty!", {variant: "error"});
        } else if (!(scheduleDateTime > new Date())) {
            enqueueSnackbar("Schedule DateTime Invalid!", {variant: "error"});
        } else if (file !== "" && fileType !== "image") {
            enqueueSnackbar("Please upload valid file type!", {variant: "error"});
        } else if (rowData && file === "") {
            let payload = {
                title,
                description,
                scheduleDateTime,
                meetingPoint,
            };
            const docRef = doc(db, "drive", rowData.id)
            await updateDoc(docRef, payload).then(() => {
                enqueueSnackbar("Updated the drive!", {variant: "success"});
                setTitle("")
                setDescription("")
                setMeetingPoint("")
                setLoading(false);
                onClose();
            })

        } else {
            console.log("new date : ", new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate(), scheduleTime.getHours(), scheduleTime.getMinutes()))

            const storageRef = ref(storage, "Drives/" + v4() + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            await uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    setLoading(true);
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    await getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

                        if (rowData) {
                            let payload = {
                                title,
                                description,
                                scheduleDateTime,
                                meetingPoint,
                                "thumbnail": downloadURL,
                            };
                            const docRef = doc(db, "drive", rowData.id)
                            await updateDoc(docRef, payload).then(() => {
                                enqueueSnackbar("Updated the drive!", {variant: "success"});
                                setTitle("")
                                setDescription("")
                                setMeetingPoint("")
                                setLoading(false);
                                onClose();
                            })

                        } else {
                            await addDoc(collection(db, "drive"), {
                                title: title.trim(),
                                description: description.trim(),
                                scheduleDateTime: scheduleDateTime,
                                meetingPoint: meetingPoint.trim(),
                                thumbnail: downloadURL,
                                participantList:[],
                                album:[],
                            }).then(async (value) => {
                                // let payload = {
                                //     driveId: value.id,
                                //     title: title.trim(),
                                //     scheduleDateTime: scheduleDateTime,
                                //     thumbnail: downloadURL,
                                //     pending: [],
                                //     approved: [],
                                // };
                                // const docRef = doc(db, "album", value.id)
                                // await  setDoc(docRef, payload).then(() => {
                                    enqueueSnackbar("Done", {variant: "success"});
                                    setTitle("")
                                    setDescription("")
                                    setMeetingPoint("")
                                    setLoading(false);
                                // })

                            });


                        }
                    });
                }
            );
        }
        setLoading(false);
    };


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
                        <Grid container item direction={"column"}>
                            <Grid item sx={{paddingTop: "20px"}}>
                                {/*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*/}
                                <Grid item sx={{}}>
                                    <TextField margin="dense" id="outlined-basic"
                                               fullWidth
                                               sx={{width: "100%", minWidth: "150px"}}
                                               variant="outlined" label={"Title"}
                                               value={title}
                                               onInput={(e) => setTitle(e.target.value)}/>
                                    {/*<CustomTextField/>*/}
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* -----------------------Description---------------------------- */}

                        <Grid container item direction={"column"}>
                            <Grid item sx={{paddingTop: "20px"}}>
                                {/*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*/}
                                <Grid item sx={{}}>
                                    <TextField margin="dense" id="outlined-basic"
                                               fullWidth
                                               sx={{width: "100%", minWidth: "150px"}}
                                               variant="outlined" label={"Description"}
                                               value={description}
                                               onInput={(e) => setDescription(e.target.value)}/>
                                    {/*<CustomTextField/>*/}
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* -----------------------Date---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date"
                                    value={scheduleDate}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField margin="dense" fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* -----------------------Time---------------------------- */}
                        <Grid item sx={{paddingTop: "20px"}} xs={5.5}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label="Time"
                                    value={scheduleTime}
                                    onChange={handleTimeChange}
                                    renderInput={(params) => <TextField margin="dense" fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>


                        {/* -----------------------Meeting Point---------------------------- */}

                        <Grid container item direction={"column"}>
                            <Grid item sx={{paddingTop: "20px"}}>
                                {/*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*/}
                                <Grid item sx={{}}>
                                    <TextField margin="dense" id="outlined-basic"

                                               sx={{width: "100%", minWidth: "150px"}}
                                               variant="outlined" label={"Meeting Point"}
                                               value={meetingPoint}
                                               onInput={(e) => setMeetingPoint(e.target.value)}/>
                                    {/*<CustomTextField/>*/}
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* -----------------------File---------------------------- */}

                        <CustomUpload title={"Upload File"} fileRef={fileRef} file={file} setFile={setFile}
                                      setFileType={setFileType} imageAccess setFileName={setFileName} editMode
                                      fileName={fileName}/>


                        {/*/!* -----------------------Rule & Regulations---------------------------- *!/*/}

                        {/*<Grid container item direction={"column"}>*/}
                        {/*    <Grid item sx={{paddingTop: "20px"}}>*/}
                        {/*        /!*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*!/*/}
                        {/*        <Grid item sx={{}}>*/}
                        {/*            <TextField margin="dense" id="outlined-basic"*/}

                        {/*                       rows={9}*/}
                        {/*                       sx={{width: "100%", minWidth: "150px"}}*/}
                        {/*                       variant="outlined" label={"Rule & Regulations"}*/}
                        {/*                       value={ruleRegulation}*/}
                        {/*                       onInput={(e) => setRuleRegulation(e.target.value)}/>*/}
                        {/*            /!*<CustomTextField/>*!/*/}
                        {/*        </Grid>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}

                    </Grid>
                    <Grid sx={{paddingTop: "30px"}}>
                        <LoadingButton type="submit" loading={loading} variant={"contained"} color={"primary"}
                                       sx={{width: "100%", height: "50px", borderRadius: "10px"}}
                        >{rowData ? "Update Drive" : "Register"}</LoadingButton>
                    </Grid>
                </form>
            </Grid>

        </Box>
    );
};

export default CreateDrive;
