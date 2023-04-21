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
import UsersTableBody from "./UsersTableBody";
import CustomDialog from "../../../components/CustomDialog";
import {getComparator, stableSort} from "../../../utills/UtilFunction";
import moment from "moment";



const collectionMenuItems = [
    {id: 0, value: "all", text: "All"},
    {id: 1, value: "name", text: "Name"},
    {id: 2, value: "email", text: "Email"},
    {id: 3, value: "contactNo", text: "ContactNo"},
    {id: 4, value: "type", text: "Type"},
];
const collectionHeadCells = [
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
        id: 'contactNo',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'ContactNo',
    },
    {
        id: 'type',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Type',
    },
    {
        id: 'options',
        numeric: true,
        disablePadding: false,
        align: "left",
        sort: true,
        label: 'Options',
    },

];


const ApprovedUsersTable = ({role, getAllProfiles, profileList, setProfileList, setRows, rows}) => {

    const [filterValue, setFilterValue] = React.useState('all');
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
        let newData = profileList.filter(item => {
            console.log("requestSearch : ", item)
            if (keyword === "") return item;
            else if ((item.contactNo.toLowerCase().includes(keyword.toLowerCase()) || item.type.toLowerCase().includes(keyword.toLowerCase()) || item.name.toLowerCase().includes(keyword.toLowerCase()) || item.email.toLowerCase().includes(keyword.toLowerCase())) && filterValue === "all") {
                return item;
            } else if (item.contactNo.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "contactNo") {
                return item;
            } else if (item.name.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "name") {
                return item;
            } else if (item.email.toLowerCase().includes(keyword.toLowerCase()) && filterValue === "email") {
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
                                .filter((value) => value.adminApproval === false)
                                .map((row, index) => (
                                    <UsersTableBody getAllProfiles={getAllProfiles} id={"Pending"} key={row.name} row={row} handleOpen={handleOpen}
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

export default ApprovedUsersTable;
