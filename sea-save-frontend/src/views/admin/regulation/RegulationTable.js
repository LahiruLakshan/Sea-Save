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
import CreateRegulation from "./CreateRegulation";

const collectionMenuItems = [
    {id: 0, value: "all", text: "All"},
    {id: 1, value: "author", text: "Author"},
    {id: 2, value: "title", text: "Title"},
    {id: 3, value: "lastUpdated", text: "Last Updated"},
];
const collectionHeadCells = [
    {
        id: 'createdDateTime',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Schedule DateTime',
    },
    {
        id: 'author',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Author',
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
        id: 'lastUpdated',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Last Updated',
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

const RegulationTable = ({name}) => {

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
    const [orderBy, setOrderBy] = React.useState('createdDateTime');

    //pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //dialog
    const [regulationDeleteDialogOpen, setRegulationDeleteDialogOpen] = React.useState(false);


    //search functions
    const requestSearch = (searchedVal) => {
        let keyword = searchedVal.target.value;
        let newData = collectionList.filter(item => {
            // console.log("requestSearch : ", item.firstName)
            if (keyword === "") return item;
            else if ((item.author.toLowerCase().includes(keyword.toLowerCase()) || item.lastUpdated.toLowerCase().includes(keyword.toLowerCase()) || item.title.toLowerCase().includes(keyword.toLowerCase()) || moment(item.createdDateTime.toDate()).format('MMMM Do YYYY, h:mm a').toLowerCase().includes(keyword.toLowerCase())) && filterValue === "all") {
                return item;
            } else if (moment(item.createdDateTime.toDate()).format('MMMM Do YYYY, h:mm a').includes(keyword.toLowerCase()) && filterValue === "createdDateTime") {
                return item;
            } else if (item.author.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "author") {
                return item;
            } else if (item.title.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "title") {
                return item;
            } else if (item.lastUpdated.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "lastUpdated") {
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
        const colRef = collection(db, "regulation");
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
        const docRef = doc(db, "regulation", row.id);
        await deleteDoc(docRef).then(() => {
                setRegulationDeleteDialogOpen(false);
                enqueueSnackbar("Regulation deleted successfully!", {variant: "success"})
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
                                            <TableCell align="left">{moment(row.createdDateTime.toDate()).format('MMMM Do YYYY, h:mm a')}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.author}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.title}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.lastUpdated}
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
                                                         setRegulationDeleteDialogOpen(true);
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
                onClose={() => setRegulationDeleteDialogOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete item"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete the item ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRegulationDeleteDialogOpen(false)} variant={"outlined"}>{"No thanks"}</Button>
                    <Button onClick={() => deleteCollection(row)} variant={"contained"}>{"Delete"}</Button>
                </DialogActions>
            </Dialog>
            <CustomDialog
                onClose={handleClose} closeBtn
                open={open} title={"Edit Regulation"}>
                <CreateRegulation rowData={rowData} name={name} onClose={handleClose}/>
            </CustomDialog>
        </Box>
    );
};

export default RegulationTable;
