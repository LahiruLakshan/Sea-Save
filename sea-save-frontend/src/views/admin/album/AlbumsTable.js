import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import {collection, onSnapshot, query, where, orderBy} from "firebase/firestore";
import {db} from "../../../firebase";
import EnhancedTableToolbar from "../../../components/EnhancedTableToolbar";
import TablePagination from "@mui/material/TablePagination";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import {getComparator, stableSort} from "../../../utills/UtilFunction";
import moment from "moment";
import UsersTableBody from "../user/UsersTableBody";
import AlbumsTableBody from "./AlbumsTableBody";



const collectionMenuItems = [
    {id: 0, value: "all", text: "All"},
    {id: 1, value: "createDateTime", text: "Created Date&Time"},
    {id: 2, value: "username", text: "Users Name"},
    {id: 3, value: "title", text: "Title"},
];
const collectionHeadCells = [
    {
        id: 'createDateTime',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Registered',
    },
    {
        id: 'username',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Users Name',
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
        id: 'viewMore',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: false,
        label: 'View More',
    },

];


const AlbumsTable = ({role, status}) => {

    const [collectionList, setCollectionList] = useState([]);
    const [filterValue, setFilterValue] = React.useState('all');
    const [rows, setRows] = useState([]);
    //Modal
    const [rowData, setRowData] = React.useState("");
    const [open, setOpen] = React.useState(false);

    //sort
    const [tableOrder, setTableOrder] = React.useState('asc');
    const [tableOrderBy, setTableOrderBy] = React.useState('createDateTime');

    //pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);


    //search functions
    const requestSearch = (searchedVal) => {
        let keyword = searchedVal.target.value;
        let newData = collectionList.filter(item => {
            console.log("requestSearch : ", item)
            if (keyword === "") return item;
            else if ((item.username.toLowerCase().includes(keyword.toLowerCase()) || item.name.toLowerCase().includes(keyword.toLowerCase()) || item.email.toLowerCase().includes(keyword.toLowerCase())) && filterValue === "all") {
                return item;
            } else if (item.username.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "username") {
                return item;
            } else if (item.title.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "title") {
                return item;
            } else if (moment(item.createDateTime.toDate()).format('MMMM Do YYYY, h:mm a').toLowerCase().includes(keyword.toLowerCase()) && filterValue === "createDateTime") {
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
        const colRef = collection(db, "album");
        const dataQuery = query(colRef,
            where("isAdminApproved", "==", status),
            // orderBy("createDateTime", "desc")
            );
        onSnapshot(
            dataQuery,
            (snapShot) => {
                let list = [];
                snapShot.docs.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()});
                });
                setCollectionList(list);
                setRows(list);
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
    return (
        <Box sx={{width: '100%',}}>
            <Paper sx={{width: '100%', mb: 2,}}>
                <EnhancedTableToolbar tableName={status?"Approved Albums Table":"Pending Albums Table"} menuItems={collectionMenuItems}
                                      requestSearch={requestSearch}
                                      handleChange={handleChange} filter={filterValue}/>
                <TableContainer sx={{maxHeight: "55vh"}}>
                    <Table aria-label="collapsible table">
                        <EnhancedTableHead
                            order={tableOrder}
                            orderBy={tableOrderBy}
                            setOrder={setTableOrder}
                            setOrderBy={setTableOrderBy}
                            spaceCell={false}
                            headCells={collectionHeadCells}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(tableOrder, tableOrderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <AlbumsTableBody id={"Pending"} key={row.id} row={row} handleOpen={handleOpen}
                                                    stableSort={stableSort} getComparator={getComparator} role={role}/>
                                ))}

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
        </Box>
    );
};

export default AlbumsTable;
