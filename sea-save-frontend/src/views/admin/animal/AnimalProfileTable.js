import React, {useEffect, useState} from 'react';
import {collection, deleteDoc, doc, onSnapshot} from "firebase/firestore";
import {db} from "../../../firebase";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import EnhancedTableToolbar from "../../../components/EnhancedTableToolbar";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import {Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab} from "@mui/material";
import {useSnackbar} from "notistack";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import {getComparator, stableSort} from "../../../utills/UtilFunction";
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";
import CustomDialog from "../../../components/CustomDialog";
import CreateChallenge from "../challenge/CreateChallenge";
import CreateAnimalProfile from "./CreateAnimalProfile";
import EditIcon from "@mui/icons-material/Edit";

const collectionMenuItems = [
    {id: 0, value: "all", text: "All"},
    {id: 1, value: "name", text: "Name"},
    {id: 2, value: "description", text: "Description"},
    {id: 2, value: "mainThreat", text: "Main Threat"},
];
const collectionHeadCells = [
    {
        id: 'image',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: '',
    },
    {
        id: 'name',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Name',
    },
    {
        id: 'mainThreat',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Main Threat',
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

const AnimalProfileTable = ({ setRows, rows, animalsList, getAllAnimals, setAnimalsList}) => {

    const {enqueueSnackbar} = useSnackbar();
    const [filterValue, setFilterValue] = React.useState('all');
    const [row, setRow] = useState([]);
    //Modal
    const [rowData, setRowData] = React.useState("");
    const [open, setOpen] = React.useState(false);

    //sort
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('companyName');

    //pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //dialog
    const [collectionDeleteDialogOpen, setCollectionDeleteDialogOpen] = React.useState(false);

    //search functions
    const requestSearch = (searchedVal) => {
        let keyword = searchedVal.target.value;
        let newData = animalsList.filter(item => {
            // console.log("requestSearch : ", item.firstName)
            if (keyword === "") return item;
            else if ((item.name.toLowerCase().includes(keyword.toLowerCase()) || item.mainThreat.toLowerCase().includes(keyword.toLowerCase()) || item.description.toLowerCase().includes(keyword.toLowerCase()) || item.mainThreat.toLowerCase().includes(keyword.toLowerCase())) && filterValue === "all") {
                return item;
            } else if (item.name.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "name") {
                return item;
            } else if (item.description.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "description") {
                return item;
            } else if (item.mainThreat.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "mainThreat") {
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

    const deleteCollection = async (row) => {

        await axios.delete(`${BASE_URL}animal/delete/${row._id}`).then(() => {
                setCollectionDeleteDialogOpen(false);
                enqueueSnackbar("Animal deleted successfully!", {variant: "success"})
                getAllAnimals()
            }
        );
    }
    return (
        <Box sx={{width: '100%',}}>
            <Paper sx={{width: '100%', mb: 2,}}>
                <EnhancedTableToolbar tableName={"AnimalProfile Table"} menuItems={collectionMenuItems}
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
                                        <TableRow key={index} sx={{'& > *': {borderBottom: 'unset'}}}>
                                            <TableCell
                                                align="left">
                                                <Avatar src={row.imageUrl} onClick={() => window.open(row.imageUrl, "_blank")} sx={{width: 56, height: 56, cursor:"pointer"}}/>
                                            </TableCell>
                                            <TableCell align="left">{row.name}</TableCell>
                                            <TableCell align="left">{row.mainThreat}</TableCell>
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
                                                         setCollectionDeleteDialogOpen(true);
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
            <CustomDialog
                onClose={handleClose} closeBtn
                open={open} title={"Edit Animal"}>
                <CreateAnimalProfile rowData={rowData} onClose={handleClose} getAllAnimals={() => getAllAnimals()}/>
            </CustomDialog>
        </Box>
    );
};

export default AnimalProfileTable;
