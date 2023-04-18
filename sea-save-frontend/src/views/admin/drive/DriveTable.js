import React, {useEffect, useState} from 'react';
import Paper from "@mui/material/Paper";
import EnhancedTableToolbar from "../../../components/EnhancedTableToolbar";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import TableBody from "@mui/material/TableBody";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import {collection, deleteDoc, doc, onSnapshot} from "firebase/firestore";
import {db} from "../../../firebase";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import TableRow from "@mui/material/TableRow";
import CustomDialog from "../../../components/CustomDialog";
import CreateDrive from "./CreateDrive";
import {useSnackbar} from "notistack";
import {getComparator, stableSort} from "../../../utills/UtilFunction";
import moment from "moment";

const collectionMenuItems = [
    {id: 0, value: "all", text: "All"},
    {id: 1, value: "title", text: "Title"},
    {id: 2, value: "meetingPoint", text: "Meeting Point"},
    {id: 3, value: "scheduleDateTime", text: "Schedule DateTime"},
];
const collectionHeadCells = [
    {
        id: 'scheduleDateTime',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Schedule DateTime',
    },
    {
        id: 'title',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Title',
    },
    {
        id: 'meetingPoint',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Meeting Point',
    },

    {
        id: 'options',
        numeric: true,
        disablePadding: false,
        align: "center",
        sort:false,
        label: 'Edit/Delete',
    }

];

const DriveTable = () => {

    const {enqueueSnackbar} = useSnackbar();
    const [collectionList, setCollectionList] = useState([]);
    const [filterValue, setFilterValue] = React.useState('all');
    const [rows, setRows] = useState([]);
    const [row, setRow] = useState([]);
    //Modal
    const [rowData, setRowData] = React.useState("");
    const [open, setOpen] = React.useState(false);

    //sort
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('scheduleDateTime');

    //pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //dialog
    const [driveDeleteDialogOpen, setDriveDeleteDialogOpen] = React.useState(false);


    //search functions
    const requestSearch = (searchedVal) => {
        let keyword = searchedVal.target.value;
        let newData = collectionList.filter(item => {
            // console.log("requestSearch : ", item.firstName)
            if (keyword === "") return item;
            else if ((item.address.toLowerCase().includes(keyword.toLowerCase()) || item.title.toLowerCase().includes(keyword.toLowerCase()) || item.meetingPoint.toLowerCase().includes(keyword.toLowerCase()) || moment(item.scheduleDateTime.toDate()).format('MMMM Do YYYY, h:mm a').toLowerCase().includes(keyword.toLowerCase())) && filterValue === "all") {
                return item;
            } else if (moment(item.scheduleDateTime.toDate()).format('MMMM Do YYYY, h:mm a').includes(keyword.toLowerCase()) && filterValue === "scheduleDateTime") {
                return item;
            } else if (item.title.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "title") {
                return item;
            } else if (item.meetingPoint.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "meetingPoint") {
                return item;
            }

        })
        setRows(newData);
    };
    const handleChange = (event) => {
        setFilterValue(event.target.value);
    };


    //start load user data
    useEffect(() => {
        const colRef = collection(db, "drive");
        onSnapshot(
            colRef,
            (snapShot) => {
                let list = [];
                snapShot.docs.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()});
                });
                setCollectionList(list);
                setRows(list);
                console.log("-----setCompanyList---- ");
            },
            (error) => {
                console.log(error);
            }
        )
    }, [])


    //pagination functions
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // modal actions
    const handleClose = () => setOpen(false);
    const handleOpen = (row) => {
        console.log("setRowData : ", row);
        setRowData(row);
        setOpen(true);
    };

    const deleteCollection = async (row) => {
        const docRef = doc(db, "drive", row.id);
        await deleteDoc(docRef).then(() => {
                setDriveDeleteDialogOpen(false);
                enqueueSnackbar("Drive deleted successfully!", {variant: "success"})
            }
        );
    }

    return (
        <Box sx={{width: '100%',}}>
           <Paper sx={{width: '100%', mb: 2,}}>
                    <EnhancedTableToolbar tableName={"Drive Table"} menuItems={collectionMenuItems}
                                          requestSearch={requestSearch}
                                          handleChange={handleChange} filter={filterValue}/>
                    <TableContainer sx={{maxHeight: "55vh"}}>
                        <Table aria-label="collapsible table">
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                setOrder={setOrder}
                                setOrderBy={setOrderBy}
                                spaceCell={false}
                                headCells={collectionHeadCells}
                            />
                            <TableBody>
                                {
                                   stableSort(rows, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => (
                                                <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                                                    <TableCell align="left">{moment(row.scheduleDateTime.toDate()).format('MMMM Do YYYY, h:mm a')}</TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.title}
                                                    </TableCell>
                                                    <TableCell align="left">{row.meetingPoint}</TableCell>
                                                    <TableCell align="center">
                                                        <Fab size="small" aria-label="edit"
                                                             sx={{marginRight: 1, color: "#000000", backgroundColor: "#fff"}}
                                                             onClick={() => handleOpen(row)}
                                                            >
                                                            <EditIcon/>
                                                        </Fab>
                                                        <Fab size="small" aria-label="add" sx={{marginLeft: 1, color: "#ff0000", backgroundColor: "#fff"}}
                                                             onClick={() => {
                                                                 setRow(row);
                                                                 setDriveDeleteDialogOpen(true);
                                                             }}>
                                                            <DeleteForeverRoundedIcon/>
                                                        </Fab>
                                                    </TableCell>

                                                </TableRow>
                                            ))

                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            {/*-----------Delete Dialog Users --------*/}
            <Dialog
                open={driveDeleteDialogOpen}
                keepMounted
                onClose={() => setDriveDeleteDialogOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete item"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete the item ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDriveDeleteDialogOpen(false)} variant={"outlined"}>{"No thanks"}</Button>
                    <Button onClick={() => deleteCollection(row)} variant={"contained"}>{"Delete"}</Button>
                </DialogActions>
            </Dialog>
            <CustomDialog
                onClose={handleClose} closeBtn
                open={open} title={"Edit Drive"}>
                <CreateDrive rowData={rowData} onClose={handleClose}/>
            </CustomDialog>
        </Box>
    );
};

export default DriveTable;
