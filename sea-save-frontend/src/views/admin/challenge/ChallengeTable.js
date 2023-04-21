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
import CreateChallenge from "./CreateChallenge";
import {useSnackbar} from "notistack";
import {getComparator, stableSort} from "../../../utills/UtilFunction";
import moment from "moment";
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";

const collectionMenuItems = [
    {id: 0, value: "all", text: "All"},
    {id: 1, value: "title", text: "Title"},
    {id: 2, value: "description", text: "Description"},
];
const collectionHeadCells = [

    {
        id: 'title',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Title',
    },
    {
        id: 'description',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Description',
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

const ChallengeTable = ({rows, setRows, challengesList, setChallengesList, getAllChallenges}) => {

    const {enqueueSnackbar} = useSnackbar();
    const [filterValue, setFilterValue] = React.useState('all');
    const [rowData, setRowData] = React.useState("");
    const [row, setRow] = useState([]);
    //Modal

    const [open, setOpen] = React.useState(false);

    //sort
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('title');

    //pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //dialog
    const [challengeDeleteDialogOpen, setChallengeDeleteDialogOpen] = React.useState(false);


    //search functions
    const requestSearch = (searchedVal) => {
        let keyword = searchedVal.target.value;
        let newData = challengesList.filter(item => {
            // console.log("requestSearch : ", item.firstName)
            if (keyword === "") return item;
            else if ((item.title.toLowerCase().includes(keyword.toLowerCase()) || item.description.toLowerCase().includes(keyword.toLowerCase())) && filterValue === "all") {
                return item;
            } else if (item.title.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "title") {
                return item;
            } else if (item.description.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "description") {
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
        await axios.delete(`${BASE_URL}challenge/delete/${row._id}`).then(() => {
                setChallengeDeleteDialogOpen(false);
                enqueueSnackbar("Challenge deleted successfully!", {variant: "success"})
            getAllChallenges()
            }
        );
    }

    return (
        <Box sx={{width: '100%',}}>
           <Paper sx={{width: '100%', mb: 2,}}>
                    <EnhancedTableToolbar tableName={"Challenge Table"} menuItems={collectionMenuItems}
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
                                                    <TableCell component="th" scope="row">
                                                        {row.title}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.description}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Fab size="small" aria-label="edit"
                                                             sx={{margin: 1, color: "#000000", backgroundColor: "#fff"}}
                                                             onClick={() => handleOpen(row)}
                                                            >
                                                            <EditIcon/>
                                                        </Fab>
                                                        <Fab size="small" aria-label="add" sx={{margin: 1, color: "#ff0000", backgroundColor: "#fff"}}
                                                             onClick={() => {
                                                                 setRow(row);
                                                                 setChallengeDeleteDialogOpen(true);
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
                open={challengeDeleteDialogOpen}
                keepMounted
                onClose={() => setChallengeDeleteDialogOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete item"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete the item ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setChallengeDeleteDialogOpen(false)} variant={"outlined"}>{"No thanks"}</Button>
                    <Button onClick={() => deleteChallenge(row)} variant={"contained"}>{"Delete"}</Button>
                </DialogActions>
            </Dialog>
            <CustomDialog
                onClose={handleClose} closeBtn
                open={open} title={"Edit Challenge"}>
                <CreateChallenge rowData={rowData} onClose={handleClose} getAllChallenges={() => getAllChallenges()}/>
            </CustomDialog>
        </Box>
    );
};

export default ChallengeTable;
