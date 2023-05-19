import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import moment from "moment";
import {collection, deleteDoc, doc, onSnapshot} from "firebase/firestore";
import {db} from "../../../firebase";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import EnhancedTableToolbar from "../../../components/EnhancedTableToolbar";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import TableBody from "@mui/material/TableBody";
import {getComparator, stableSort} from "../../../utills/UtilFunction";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import TablePagination from "@mui/material/TablePagination";
import CustomDialog from "../../../components/CustomDialog";
import CreateForum from "./CreateForum";
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";

const collectionMenuItems = [
    {id: 0, value: "all", text: "All"},
    {id: 1, value: "name", text: "Author"},
    {id: 2, value: "solution", text: "Solution"},
    {id: 3, value: "time", text: "Last Updated"},
];
const collectionHeadCells = [
    {
        id: 'time',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Last Updated',
    },
    {
        id: 'name',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Author',
    },
    {
        id: 'solution',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Solution',
    },
    {
        id: 'options',
        numeric: true,
        disablePadding: false,
        align: "center",
        sort:false,
        label: 'Edit/Delete',
    },


];

const ForumTable = ({name, rows, forumList, getAllForums, setForumList, setRows}) => {

    const {enqueueSnackbar} = useSnackbar();
    const [filterValue, setFilterValue] = React.useState('all');
    const [rowData, setRowData] = React.useState("");
    const [row, setRow] = useState([]);
    //Modal

    const [open, setOpen] = React.useState(false);

    //sort
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('time');


    //pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //dialog
    const [regulationDeleteDialogOpen, setForumDeleteDialogOpen] = React.useState(false);


    //search functions
    const requestSearch = (searchedVal) => {
        let keyword = searchedVal.target.value;
        let newData = forumList.filter(item => {
            // console.log("requestSearch : ", item.firstName)
            if (keyword === "") return item;
            else if ((item.name.toLowerCase().includes(keyword.toLowerCase()) || item.time.toLowerCase().includes(keyword.toLowerCase()) || item.solution.toLowerCase().includes(keyword.toLowerCase())) && filterValue === "all") {
                return item;
            } else if (item.name.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "name") {
                return item;
            } else if (item.solution.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "solution") {
                return item;
            } else if (item.time.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "time") {
                return item;
            }

        })
        setRows(newData);
    };
    const handleChange = (event) => {
        setFilterValue(event.target.value);
    };

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

    const deleteChallenge = async (row) => {
        await axios.delete(`${BASE_URL}forum/delete/${row._id}`).then(() => {
            setForumDeleteDialogOpen(false);
            enqueueSnackbar("Solution deleted successfully!", {variant: "success"})
                getAllForums()
            }
        );
    }

    return (
        <Box sx={{width: '100%',}}>
            <Paper sx={{width: '100%', mb: 2,}}>
                <EnhancedTableToolbar tableName={"Rule & Regulations"} menuItems={collectionMenuItems}
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
                                            <TableCell align="left">{row.time}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.solution}
                                            </TableCell>
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
                                                         setForumDeleteDialogOpen(true);
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
                open={regulationDeleteDialogOpen}
                keepMounted
                onClose={() => setForumDeleteDialogOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete item"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete the item ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setForumDeleteDialogOpen(false)} variant={"outlined"}>{"No thanks"}</Button>
                    <Button onClick={() => deleteChallenge(row)} variant={"contained"}>{"Delete"}</Button>
                </DialogActions>
            </Dialog>
            <CustomDialog
                onClose={handleClose} closeBtn
                open={open} title={"Edit Forum"}>
                <CreateForum rowData={rowData} name={name} onClose={handleClose} getAllForums={() => getAllForums()}/>
            </CustomDialog>
        </Box>
    );
};

export default ForumTable;
