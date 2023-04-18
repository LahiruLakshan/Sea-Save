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

const collectionMenuItems = [
    {id: 0, value: "all", text: "All"},
    {id: 1, value: "companyName", text: "Company Name"},
    {id: 2, value: "branchName", text: "Drive City"},
    {id: 3, value: "advertisementName", text: "Advertisement Name"},
];
const collectionHeadCells = [
    {
        id: 'thumbnail',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: false,
        label: 'Thumbnail',
    },
    {
        id: 'advertisementName',
        numeric: false,
        disablePadding: true,
        align: "left",
        sort: true,
        label: 'Advertisement Name',
    },
    {
        id: 'fileType',
        numeric: false,
        disablePadding: true,
        align: "left",
        sort: true,
        label: 'File Type',
    },
    {
        id: 'orientation',
        numeric: false,
        disablePadding: true,
        align: "left",
        sort: true,
        label: 'Orientation',
    },
    {
        id: 'companyName',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Company Name',
    },
    {
        id: 'branchName',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Drive City',
    },
    {
        id: 'delete',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: false,
        label: 'Delete',
    },


];

const AdvertisementTable = () => {

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
    const [orderBy, setOrderBy] = React.useState('companyName');

    //pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //dialog
    const [collectionDeleteDialogOpen, setCollectionDeleteDialogOpen] = React.useState(false);

    //search functions
    const requestSearch = (searchedVal) => {
        let keyword = searchedVal.target.value;
        let newData = collectionList.filter(item => {
            // console.log("requestSearch : ", item.firstName)
            if (keyword === "") return item;
            else if ((item.advertisementName.toLowerCase().includes(keyword.toLowerCase()) || item.companyName.toLowerCase().includes(keyword.toLowerCase()) || item.branchName.toLowerCase().includes(keyword.toLowerCase())) && filterValue === "all") {
                return item;
            } else if (item.advertisementName.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "advertisementName") {
                return item;
            } else if (item.companyName.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "companyName") {
                return item;
            } else if (item.branchName.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "branchName") {
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
        const colRef = collection(db, "advertisement");
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

    const deleteCollection = async (row) => {

        console.log("Delete Ad :", row.file)

        const docRef = doc(db, "advertisement", row.id);
        await deleteDoc(docRef).then(() => {
                setCollectionDeleteDialogOpen(false);
                enqueueSnackbar("Advertisement deleted successfully!", {variant: "success"})
            }
        );
        // setCollectionDeleteDialogOpen(false);
    }
    return (
        <Box sx={{width: '100%',}}>
            <Paper sx={{width: '100%', mb: 2,}}>
                <EnhancedTableToolbar tableName={"Advertisement Table"} menuItems={collectionMenuItems}
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
                                            {
                                                row.fileType === "image" ?
                                                    <TableCell
                                                               align="left">
                                                        <Avatar src={row.file} onClick={() => window.open(row.file, "_blank")} sx={{width: 56, height: 56, cursor:"pointer"}}/>
                                                    </TableCell>
                                                    :
                                                    <TableCell
                                                               align="left">
                                                        <Avatar sx={{width: 56, height: 56, cursor:"pointer"}}
                                                                src={row.thumbnail}
                                                                onClick={() => window.open(row.file, "_blank")}>
                                                            {/*<video width={56} height={56} src={row.file}/>*/}
                                                        </Avatar>
                                                    </TableCell>}

                                            <TableCell align="left">{row.advertisementName}</TableCell>
                                            <TableCell align="left">{row.fileType}</TableCell>
                                            <TableCell align="left">{row.orientation}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.companyName}
                                            </TableCell>
                                            <TableCell align="left">{row.branchName}</TableCell>
                                            <TableCell align="center">
                                                <Fab size="small" aria-label="add" sx={{marginLeft: 1, color: "#ff0000", backgroundColor: "#fff"}}
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
        </Box>
    );
};

export default AdvertisementTable;
