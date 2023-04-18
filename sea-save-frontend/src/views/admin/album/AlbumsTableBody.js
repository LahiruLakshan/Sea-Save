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
import AlbumView from "./AlbumView";
import theme from "../../../theme";
import CustomDialog from "../../../components/CustomDialog";
import moment from "moment";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

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
        sort: false,
        label: 'Delete',
    },
    {
        id: 'launch',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: false,
        label: 'Launch',
    }

];

function AlbumsTableBody(props) {
    const {id, row, role} = props;
    const {enqueueSnackbar} = useSnackbar();

    //dialog
    const [collectionDeleteDialogOpen, setCollectionDeleteDialogOpen] = React.useState(false);
    const [scheduleDeleteDialogOpen, setScheduleDeleteDialogOpen] = React.useState(false);
    const [scheduleDialogOpen, setScheduleDialogOpen] = React.useState(false);

    const deleteCollection = async (row) => {
        const docRef = doc(db, "collection", row.id);
        await deleteDoc(docRef).then(() => {
                setCollectionDeleteDialogOpen(false);
                enqueueSnackbar("Users deleted successfully!", {variant: "success"})
            }
        );
    }

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell
                    align="left">{moment(row.adminAlbumApprovedTime.toDate()).format('MMMM Do YYYY, h:mm a')}</TableCell>

                <TableCell align="left">
                    {row.username}
                </TableCell>
                <TableCell align="left">{row.title}</TableCell>
                <TableCell align="left">
                    <Fab size="small" aria-label="edit"
                         sx={{marginRight: 1, color: "#F18628", backgroundColor: "#fff"}}
                         onClick={() => setScheduleDialogOpen(true)}
                    >
                        <ArrowForwardRoundedIcon/>
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
                    <Button onClick={() => setCollectionDeleteDialogOpen(false)}
                            variant={"outlined"}>{"No thanks"}</Button>
                    <Button onClick={() => deleteCollection(row)} variant={"contained"}>{"Delete"}</Button>
                </DialogActions>
            </Dialog>

            {/*-----------Delete Dialog AlbumView --------*/}
            <Dialog
                open={scheduleDeleteDialogOpen}
                keepMounted
                onClose={() => setScheduleDeleteDialogOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete item"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete the item ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScheduleDeleteDialogOpen(false)}
                            variant={"outlined"}>{"No thanks"}</Button>
                    {/*<Button onClick={() => deleteSchedule()} variant={"contained"}>{"Delete"}</Button>*/}
                </DialogActions>
            </Dialog>

            {/*---------AlbumView Dialog----------*/}
            <CustomDialog
                fullScreen
                closeBtn
                open={scheduleDialogOpen} title={"AlbumView"}
                onClose={() => setScheduleDialogOpen(false)}
            >
                <AlbumView rowData={row} role={role} setScheduleDialogOpen={setScheduleDialogOpen}/>
            </CustomDialog>
        </React.Fragment>
    );
}

export default AlbumsTableBody;
