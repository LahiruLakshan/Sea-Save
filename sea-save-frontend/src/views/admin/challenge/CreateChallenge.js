import React, {useEffect, useRef, useState} from 'react';
import {Box, Grid, Paper, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {db, storage} from "../../../firebase";
import {useSnackbar} from "notistack";
import CustomUpload from "../../../components/CustomUpload";
import {uploadBytesResumable, ref, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";

const CreateChallenge = (props) => {

    const {rowData, onClose, getAllChallenges} = props;
    const [loading, setLoading] = React.useState(false);
    const [title, setTitle] = useState(rowData ? rowData?.title : "");
    const [description, setDescription] = useState(rowData ? rowData?.description : "");
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState(rowData ? rowData?.fileName : "");
    const [fileType, setFileType] = useState(rowData ? rowData?.fileType : "");

    let fileRef = useRef(null);

    const {enqueueSnackbar} = useSnackbar();


    const submitDetails = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (title === "") {
            enqueueSnackbar("Title Name Empty!", {variant: "error"});
        } else if (description === "") {
            enqueueSnackbar("Description Empty!", {variant: "error"});
        } else if (file !== "" && fileType !== "image") {
            enqueueSnackbar("Please upload valid file type!", {variant: "error"});
        } else if (rowData && file === "") {

            const formData = {
                imageUrl: rowData.imageUrl,
                title: title.trim(),
                description: description.trim()
            }

            await axios.put(`${BASE_URL}challenge/update/${rowData._id}`, formData)
                .then((res) => {
                    console.log("Challenge update RES : ", res)
                    enqueueSnackbar("Done", {variant: "success"});
                    setTitle("")
                    setDescription("")
                    setLoading(false);
                    getAllChallenges();
                    onClose();
                }).catch((err) => {
                    console.log("Challenge update ERRor : ", err)
                })

        }  else if (file === "") {
            enqueueSnackbar("Image file empty!", {variant: "error"});
        } else {
            console.log("=====Challenge update RES : ")
            const storageRef = ref(storage, "Challenges/" + v4() + file.name);
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
                            console.log("=====Challenge update RES : ", rowData._id)
                            const formData = {
                                imageUrl: downloadURL,
                                title: title.trim(),
                                description: description.trim()
                            }

                            await axios.put(`${BASE_URL}challenge/update/${rowData._id}`, formData)
                                .then((res) => {
                                    console.log("Challenge update RES : ", res)
                                    enqueueSnackbar("Done", {variant: "success"});
                                    setTitle("")
                                    setDescription("")
                                    setLoading(false);
                                    onClose();
                                    getAllChallenges();
                                }).catch((err) => {
                                    console.log("Challenge update ERRor : ", err)
                                })
                        } else {

                            const formData = {
                                imageUrl: downloadURL,
                                title: title.trim(),
                                description: description.trim()
                            }

                            await axios.post(`${BASE_URL}challenge/create`, formData)
                                .then((res) => {
                                    console.log("Challenge create RES : ", res)
                                    enqueueSnackbar("Done", {variant: "success"});
                                    setTitle("")
                                    setDescription("")
                                    setLoading(false);
                                    getAllChallenges();
                                }).catch((err) => {
                                console.log("Challenge create ERRor : ", err)
                            })


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

                        {/* -----------------------File---------------------------- */}

                        <CustomUpload title={"Upload File"} fileRef={fileRef} file={file} setFile={setFile}
                                      setFileType={setFileType} imageAccess setFileName={setFileName} editMode
                                      fileName={fileName}/>




                    </Grid>
                    <Grid sx={{paddingTop: "30px"}}>
                        <LoadingButton type="submit" loading={loading} variant={"contained"} color={"primary"}
                                       sx={{width: "100%", height: "50px", borderRadius: "10px"}}
                        >{rowData ? "Update Challenge" : "Create Challenge"}</LoadingButton>
                    </Grid>
                </form>
            </Grid>

        </Box>
    );
};

export default CreateChallenge;
