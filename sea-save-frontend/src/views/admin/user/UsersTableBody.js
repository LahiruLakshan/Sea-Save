import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import {collection, deleteDoc, doc, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../../../firebase";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import EnhancedTableToolbar from "../../../components/EnhancedTableToolbar";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import TableBody from "@mui/material/TableBody";
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import UserView from "./UserView";
import theme from "../../../theme";
import CustomDialog from "../../../components/CustomDialog";
import moment from "moment";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const scheduleMenuItems = [
    {id: 0, value: "date", text: "Date"},
    {id: 1, value: "title", text: "Title"},
    {id: 3, value: "duration", text: "Duration"},
];
const scheduleHeadCells = [
    {
        id: 'date',
        numeric: false,
        disablePadding: true,
        align: "left",
        sort: false,
        label: 'Date/Time',
    },
    {
        id: 'title',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: false,
        label: 'Title',
    },
    {
        id: 'duration',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: false,
        label: 'Duration',
    },
    {
        id: 'options',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort:false,
        label: 'Delete',
    },
    {
        id: 'launch',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort:false,
        label: 'Launch',
    }

];

function UsersTableBody(props) {
    const {id, row, role, getAllProfiles} = props;
    const {enqueueSnackbar} = useSnackbar();

    //dialog
    const [collectionDeleteDialogOpen, setCollectionDeleteDialogOpen] = React.useState(false);
    const [collectionUpdateDialogOpen, setCollectionUpdateDialogOpen] = React.useState(false);

    const deleteCollection = async (row) => {
        await axios.delete(`${BASE_URL}profile/delete/${row._id}`).then(() => {
                setCollectionDeleteDialogOpen(false);
                enqueueSnackbar("Challenge deleted successfully!", {variant: "success"})
                getAllProfiles()
            }
        );
    }
    useEffect(() =>{
        console.log("----------row : ", row);
    },[row])
    const updateCollection = async (row) => {
        console.log("UPDATE USER : ", row)
        const formData = {
            name: row.name,
            email: row.email,
            contactNo: row.contactNo,
            password: row.password,
            type: row.type,
            adminApproval: true
        }

        await axios.put(`${BASE_URL}profile/update/${row._id}`, formData)
            .then((res) => {
                setCollectionDeleteDialogOpen(false);
                enqueueSnackbar("Done", {variant: "success"});
                getAllProfiles()
            }).catch((err) => {
            })
    }

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>


                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">
                    {row.contactNo}
                </TableCell>
                <TableCell align="left">
                    {row.type}
                </TableCell>
                <TableCell align="left">
                    {!row.adminApproval && <Fab size="small" aria-label="edit"
                          sx={{marginRight: 1, color: "#000", backgroundColor: "#fff"}}
                          onClick={() => setCollectionUpdateDialogOpen(true)}
                    >
                        <EditIcon/>
                    </Fab>}
                    <Fab size="small" aria-label="edit"
                         sx={{marginRight: 1, color: "#ff0000", backgroundColor: "#fff"}}
                         onClick={() => setCollectionDeleteDialogOpen(true)}
                    >
                        <DeleteForeverRoundedIcon/>
                    </Fab>

                </TableCell>
            </TableRow>

            {/*-----------Delete Dialog Users --------*/}
            <Dialog
                open={collectionDeleteDialogOpen}
                keepMounted
                onClose={() => setCollectionDeleteDialogOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete item"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete the item ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCollectionDeleteDialogOpen(false)} variant={"outlined"}>{"No thanks"}</Button>
                    <Button onClick={() => deleteCollection(row)} variant={"contained"}>{"Delete"}</Button>
                </DialogActions>
            </Dialog>

            {/*-----------Update Dialog UserView --------*/}
            <Dialog
                open={collectionUpdateDialogOpen}
                keepMounted
                onClose={() => setCollectionUpdateDialogOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Update User"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to approve this admin ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCollectionUpdateDialogOpen(false)} variant={"outlined"}>{"No"}</Button>
                    <Button onClick={() => updateCollection(row)} variant={"contained"}>{"Yes"}</Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>
    );
}

export default UsersTableBody;
