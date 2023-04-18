import React from 'react';
import {Button, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloudUploadTwoToneIcon from "@mui/icons-material/CloudUploadTwoTone";

const CustomUpload = (props) => {

    const { title, fileRef, file, setFile, fileName, setFileName, setFileType, editMode} = props;

    const fileUpload = async (e) => {
        const uploadFile = e.target.files[0];

        setFile(uploadFile);
        setFileName(uploadFile.name);
        setFileType(uploadFile.type.split("/")[0]);


    }

    return (
        <Grid container item direction={"column"}>
            <Grid item sx={{paddingTop: "20px"}}>
                {/*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*/}
                <Grid item direction={"column"} xs={12}
                      container
                      justifyContent="center">
                    <Button
                        variant={"outlined"}
                        component="label"
                        color={"inherit"}
                        sx={{
                            borderRadius: "10px", borderColor: "#C4C4C4", "&:hover": {
                                borderColor: "#303030",
                            }
                        }}
                    >
                        <Grid item container direction={"column"} justifyContent="center"
                              alignItems={"center"} p={10}>
                            <Typography variant={"body2"}
                                        align={"center"}>{file ? file.name : ""}</Typography>
                            {editMode && !file && <Typography variant={"body2"}
                                         align={"center"}>{fileName ? fileName : ""}</Typography>}
                            <CloudUploadTwoToneIcon/>
                            <Typography variant={"button"} align={"center"}>{title}</Typography>
                            <input
                                ref={fileRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => fileUpload(e)}
                            />
                        </Grid>
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CustomUpload;
