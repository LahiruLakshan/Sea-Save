import React, {useEffect, useRef, useState} from 'react';
import {Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField} from "@mui/material";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {addDoc, collection, onSnapshot, query, where} from "firebase/firestore";
import {db, storage} from "../../../firebase";
import {v4} from "uuid";
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from "notistack";
import CustomUpload from "../../../components/CustomUpload";

const CreateAdvertisement = () => {

    const [loading, setLoading] = React.useState(false);

    const [companyName, setCompanyName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [advertisementName, setAdvertisementName] = useState("");
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");

    const [duration, setDuration] = useState("");

    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);

    let fileRef = useRef(null);

    const [companyList, setCompanyList] = useState([]);
    const [advertisementList, setAdvertisementList] = useState([]);
    const [allCompanyList, setAllCompanyList] = useState([]);
    const [allBranchList, setAllBranchList] = useState([]);
    const [orientation, setOrientation] = useState("");

    const [thumbnail, setThumbnail] = useState("");

    const {enqueueSnackbar} = useSnackbar();

    const caseInSensitive = (x, y) => {
        return x.toLocaleLowerCase() === y.toLocaleLowerCase()
    }


    const submitDetails = async () => {
        setLoading(true);

        console.log("Submit");
        if (companyName === "") {
            enqueueSnackbar("Company name empty!", {variant: "error"});
        } else if (branchName === "") {
            enqueueSnackbar("Drive city empty!", {variant: "error"});
        } else if (file === "") {
            enqueueSnackbar("Please upload image or video!", {variant: "error"});
        } else if (!(fileType === "video" || fileType === "image")) {
            enqueueSnackbar("Invalid file type!", {variant: "error"});
        } else if (orientation === "" && fileType === "video") {
            enqueueSnackbar("Orientation empty!", {variant: "error"});
        } else if (advertisementList.some(e => caseInSensitive(e.companyName, companyName) && caseInSensitive(e.branchName, branchName) && caseInSensitive(e.advertisementName, advertisementName))) {
            enqueueSnackbar("Already added!", {variant: "warning"});
        } else {
            const storageRef = ref(storage, v4() + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
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
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        if (fileType === "video") {
                            const storageRef = ref(storage, v4() + file.name);
                            const uploadTask = uploadBytesResumable(storageRef, thumbnail);
                            uploadTask.on(
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
                                () => {
                                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadThumbnailURL) => {
                                        let media = new Audio(downloadURL);
                                        media.onloadedmetadata = async function () {
                                            setDuration(media.duration)
                                            console.log("Time--- :", media.duration)

                                            await addDoc(collection(db, "advertisement"), {
                                                createTime: new Date(),
                                                fileName: fileName,
                                                companyName: companyName,
                                                branchName: branchName,
                                                advertisementName: advertisementName,
                                                file: downloadURL,
                                                thumbnail: downloadThumbnailURL,
                                                duration: media.duration,
                                                fileType: fileType,
                                                orientation: orientation
                                            });
                                            enqueueSnackbar("Created the advertisement!", {variant:"success"});
                                            setCompanyName("");
                                            setBranchName("");
                                            setAdvertisementName("");
                                            setDuration("");
                                            setFile("");
                                            setLoading(false);
                                        };
                                    });
                                }
                            );


                        } else if (fileType === "image") {
                            await addDoc(collection(db, "advertisement"), {
                                createTime: new Date(),
                                fileName: fileName,
                                companyName: companyName,
                                branchName: branchName,
                                advertisementName: advertisementName,
                                file: downloadURL,
                                duration: duration ? parseFloat(duration) : 1,
                                width: imageWidth,
                                height: imageHeight,
                                orientation: imageWidth > imageHeight ? "Landscape" : "Portrait",
                                fileType: fileType
                            })
                            enqueueSnackbar("Created the advertisement!", {variant:"success"});
                            setCompanyName("");
                            setBranchName("");
                            setAdvertisementName("");
                            setDuration("");
                            setFile("");
                            setLoading(false);
                        }

                    });
                }
            );
        }
        setLoading(false);
    };

    useEffect(() => {
        let company = companyList.filter((ele, ind) => ind === companyList.findIndex(elem => elem.companyName === ele.companyName))
        setAllCompanyList(company);
        let branch = companyList.filter((ele, ind) => ind === companyList.findIndex(elem => elem.branchName === ele.branchName))
        setAllBranchList(branch);
    }, [companyList, advertisementList]);

    useEffect(() => {

        const colRef = collection(db, "company");
        const adsRef = collection(db, "advertisement");
        const q = query(colRef, where("fileType", "==", "image"));

        onSnapshot(
            colRef,
            (snapShot) => {
                let list = [];
                snapShot.docs.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()});
                });
                setCompanyList(list);
            },
            (error) => {
                console.log(error);
            }
        );

        onSnapshot(
            adsRef,
            (snapShot) => {
                let list = [];
                snapShot.docs.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()});
                });
                setAdvertisementList(list);
            },
            (error) => {
                console.log(error);
            }
        )


    }, []);

    // async function cus() {
    //     await CusUploadTask(file, setLoading).then((e) => {
    //         console.log("CusUploadTask :", e);
    //         setLoading(false);
    //     })
    // }

    return (
        <Box sx={{borderRadius: 0, justifyContent: "center", alignItems: "center", display: "flex"}}>
            <Grid container justifyContent="space-around" component={Paper}
                  item lg={5.9} md={6} sm={12} xs={12} direction={"column"}
                  sx={{
                      // background: "#FBFBFB",
                      borderRadius: "10px",
                      padding: "50px",
                      marginBottom: "50px"
                  }}>
                <form action="#" method="post">

                    <Grid container direction={"column"}>
                        {/* ------------------Company Name--------------------- */}
                        <Grid container item direction={"column"}>
                            <Grid item sx={{paddingTop: "20px"}}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Company</InputLabel>
                                    <Select sx={{width: "100%", minWidth: "150px", borderRadius: "10px"}}
                                            variant="outlined"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={companyName}
                                            label="Company"
                                            onChange={(e) => {
                                                setCompanyName(e.target.value);
                                                setAllBranchList(companyList.filter((ele, ind) => ind === companyList.findIndex(elem => elem.branchName === ele.branchName && elem.companyName === e.target.value)));
                                            }}
                                    >
                                        {allCompanyList.map((value) =>
                                            <MenuItem key={value.id}
                                                      value={value.companyName}>{value.companyName}</MenuItem>
                                        )}
                                        {!allCompanyList.length &&
                                            <MenuItem disabled value={"None"}>Please register a branch</MenuItem>}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* -----------------------Drive Name---------------------------- */}

                        <Grid container item direction={"column"}>
                            <Grid item sx={{paddingTop: "20px"}}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Drive City</InputLabel>
                                    <Select sx={{width: "100%", minWidth: "150px", borderRadius: "10px"}}
                                            variant="outlined"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={branchName}
                                            label="Drive City"
                                            onChange={(e) => {
                                                setBranchName(e.target.value);
                                                setAllCompanyList(companyList.filter((ele, ind) => ind === companyList.findIndex(elem => elem.companyName === ele.companyName && elem.branchName === e.target.value)));
                                            }}
                                    >
                                        {allBranchList.map((value) =>
                                            <MenuItem key={value.id}
                                                      value={value.branchName}>{value.branchName}</MenuItem>
                                        )}
                                        {!allBranchList.length &&
                                            <MenuItem disabled value={"None"}>Please register a branch</MenuItem>}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* -----------------------Advertisement Name---------------------------- */}

                        <Grid container item direction={"column"}>
                            <Grid item sx={{paddingTop: "20px"}}>
                                {/*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*/}
                                <Grid item sx={{}}>
                                    <TextField margin="dense" id="outlined-basic"
                                               sx={{width: "100%", minWidth: "150px"}}
                                               variant="outlined" label={"Advertisement Name"}
                                               value={advertisementName}
                                               onInput={(e) => setAdvertisementName(e.target.value)}/>
                                    {/*<CustomTextField/>*/}
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* -----------------------File---------------------------- */}

                        <CustomUpload title={"Upload File"} fileRef={fileRef} file={file} setFile={setFile}
                                      setFileType={setFileType} setImageWidth={setImageWidth}
                                      setImageHeight={setImageHeight} imageAccess setFileName={setFileName}
                                      setThumbnail={setThumbnail}/>

                        {/* -----------------------Duration---------------------------- */}

                        {fileType === "image" &&
                            <Grid container item direction={"column"}>
                                <Grid item sx={{paddingTop: "20px"}}>
                                    {/*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*/}
                                    <Grid item sx={{}}>
                                        <TextField margin="dense" id="outlined-basic"
                                                   InputProps={{inputProps: {min: 1}}}
                                                   type={"number"}
                                                   sx={{width: "100%", minWidth: "150px"}}
                                                   variant="outlined" label={"Duration (seconds)"}
                                                   value={duration}
                                                   onInput={(e) => setDuration(e.target.value)}/>
                                        {/*<CustomTextField/>*/}
                                    </Grid>
                                </Grid>
                            </Grid>
                        }

                        {fileType === "video" &&
                            <Grid container item direction={"column"}>
                                <Grid item sx={{paddingTop: "20px"}}>
                                    <FormControl margin="dense" fullWidth>
                                        <InputLabel id="demo-simple-select-label">Orientation</InputLabel>
                                        <Select sx={{width: "100%", minWidth: "150px", borderRadius: "10px"}}
                                                variant="outlined"
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={orientation}
                                                label="Orientation"
                                                onChange={(e) => {
                                                    setOrientation(e.target.value);
                                                }}
                                        >

                                            <MenuItem key={1} value={"Landscape"}>Landscape</MenuItem>
                                            <MenuItem key={2} value={"Portrait"}>Portrait</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        }

                    </Grid>
                    <Grid sx={{paddingTop: "30px"}}>
                        <LoadingButton loading={loading} variant={"contained"} color={"primary"}
                                       sx={{width: "100%", height: "50px", borderRadius: "10px"}}
                                       onClick={() => submitDetails()}>Create
                            Advertisement</LoadingButton>
                    </Grid>
                </form>
            </Grid>

        </Box>
    );
};

export default CreateAdvertisement;
