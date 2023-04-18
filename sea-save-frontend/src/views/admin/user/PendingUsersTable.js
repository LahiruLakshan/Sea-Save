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
import ApprovedUsersTable from "./ApprovedUsersTable";
import UsersTableBody from "./UsersTableBody";
import CustomDialog from "../../../components/CustomDialog";
import {getComparator, stableSort} from "../../../utills/UtilFunction";
import moment from "moment";



const collectionMenuItems = [
    {id: 0, value: "all", text: "All"},
    {id: 1, value: "registerDateTime", text: "Register Date&Time"},
    {id: 2, value: "username", text: "Users Name"},
    {id: 3, value: "name", text: "Name"},
    {id: 4, value: "email", text: "Email"},
];
const collectionHeadCells = [
    {
        id: 'registerDateTime',
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
        id: 'name',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Name',
    },
    {
        id: 'email',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Email',
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


const PendingUsersTable = ({role}) => {

    const [collectionList, setCollectionList] = useState([]);
    const [filterValue, setFilterValue] = React.useState('all');
    const [rows, setRows] = useState([]);
    //Modal
    const [rowData, setRowData] = React.useState("");
    const [open, setOpen] = React.useState(false);

    //sort
    const [tableOrder, setTableOrder] = React.useState('asc');
    const [tableOrderBy, setTableOrderBy] = React.useState('registerDateTime');

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
            } else if (item.name.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "name") {
                return item;
            } else if (item.email.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "email") {
                return item;
            } else if (moment(item.registerDateTime.toDate()).format('MMMM Do YYYY, h:mm a').toLowerCase().includes(keyword.toLowerCase()) && filterValue === "registerDateTime") {
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
        const colRef = collection(db, "user");
        const dataQuery = query(colRef,
            where("adminApproval", "==", false),
            // orderBy("registerDateTime", "desc")
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
                <EnhancedTableToolbar tableName={"Pending Users Table"} menuItems={collectionMenuItems}
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
                                    <UsersTableBody id={"Pending"} key={row.name} row={row} handleOpen={handleOpen}
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

export default PendingUsersTable;
