import React from 'react';
import TablePagination from "@mui/material/TablePagination";
import {Box, TableCell} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// const columns = [
//     { id: 'block', label: 'Name', minWidth: 170 },
//     { id: 'time', label: 'ISO\u00a0Code', minWidth: 100 },
//     {
//         id: 'txn',
//         label: 'Population',
//         minWidth: 170,
//         align: 'right',
//         format: (value) => value.toLocaleString('en-US'),
//     },
//     {
//         id: 'uncles',
//         label: 'Size\u00a0(km\u00b2)',
//         minWidth: 170,
//         align: 'right',
//         format: (value) => value.toLocaleString('en-US'),
//     },
//     {
//         id: 'miner',
//         label: 'Density',
//         minWidth: 170,
//         align: 'right',
//         format: (value) => value.toFixed(2),
//     },
// ];
//
// function createData(block, time, txn, uncles, miner) {
//     // const density = population / size;
//     return { block, time, txn, uncles, miner };
// }
//
// const rows = [
//     createData(13208822, "45 secs ago", 71, 0, "Hiveon Pool"),
//     createData(13205321, "1 min ago", 409, 0, "F2Pool Old"),
//     createData(13503624, "1 min ago", 234, 0, "MiningPoolHub"),
//     createData(13205896, "2 min ago", 55, 0, "Ethermine"),
//     createData(13508927, "2 min ago", 11, 0, "F2Pool Old"),
//     createData(13578952, "2 min ago", 901, 0, "Hiveon Pool"),
//     createData(13500928, "2 min ago", 33, 0, "F2Pool Old"),
//     createData(13509914, "3 min ago", 90, 0, "Ethermine"),
//     createData(13108956, "3 min ago", 33, 0, "MiningPoolHub"),
//     createData(13568976, "4 min ago", 25, 0, "F2Pool Old"),
//     createData(13504934, "4 min ago", 710, 0, "Hiveon Pool"),
//     createData(13538990, "4 min ago", 23, 0, "Ethermine"),
// ];

const CustomTable = (props) => {
    const {rows, columns, title, handleOpen} = props;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //modal items
    // const [open, setOpen] = React.useState(false);
    // const [rowData, setRowData] = React.useState("");
    // const handleOpen = (row) => {
    //     setRowData(row);
    //     setOpen(true);
    // };
    // const handleClose = () => setOpen(false);
    return (
        <Box sx={{width: '100%', overflow: 'hidden'}}>
            <Toolbar
                sx={{
                    pl: {sm: 2},
                    pr: {xs: 1, sm: 1},
                }}
            >
                <Typography
                    sx={{flex: '1 1 100%', color: "#707070"}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            </Toolbar>
            <TableContainer sx={{maxHeight: 440}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    sx={{background: "rgba(44,63,82,0.2)",}}
                                    key={column.id}
                                    align={column.align}
                                    // style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}
                                              onClick={() => handleOpen(row)}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align} sx={{cursor:"pointer"}}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}

                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/*<Modal*/}
            {/*    aria-labelledby="transition-modal-title"*/}
            {/*    aria-describedby="transition-modal-description"*/}
            {/*    open={open}*/}
            {/*    onClose={handleClose}*/}
            {/*    closeAfterTransition*/}
            {/*    BackdropComponent={Backdrop}*/}
            {/*    BackdropProps={{*/}
            {/*        timeout: 500,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Fade in={open}>*/}
            {/*        <Box sx={{*/}
            {/*            position: 'absolute',*/}
            {/*            top: '50%',*/}
            {/*            left: '50%',*/}
            {/*            transform: 'translate(-50%, -50%)',*/}
            {/*            width: 400,*/}
            {/*            bgcolor: 'background.paper',*/}
            {/*            border: '2px solid #009CFFFF',*/}
            {/*            boxShadow: 24,*/}
            {/*            p: 4,*/}
            {/*            borderRadius: "10px"*/}
            {/*        }}>*/}
            {/*            <Typography id="transition-modal-title" pb={3} color={"#009CFFFF"}*/}
            {/*                        variant="h6" component="h2">*/}
            {/*                Transaction Details*/}
            {/*            </Typography>*/}
            {/*            <Typography id="transition-modal-title" pb={1}*/}
            {/*                        variant={"body1"} component="h2">*/}
            {/*                Block : {rowData.block}*/}
            {/*            </Typography>*/}
            {/*            <Typography id="transition-modal-title" pb={1}*/}
            {/*                        variant={"body1"} component="h2">*/}
            {/*                Timestamp : {rowData.time}*/}
            {/*            </Typography>*/}
            {/*            <Typography id="transition-modal-title" pb={1}*/}
            {/*                        variant={"body1"} component="h2">*/}
            {/*                Txn : {rowData.txn}*/}
            {/*            </Typography>*/}
            {/*            <Typography id="transition-modal-title" pb={1}*/}
            {/*                        variant={"body1"} component="h2">*/}
            {/*                Uncles : {rowData.uncles}*/}
            {/*            </Typography>*/}
            {/*            <Typography id="transition-modal-title" pb={1}*/}
            {/*                        variant={"body1"} component="h2">*/}
            {/*                Miner : {rowData.miner}*/}
            {/*            </Typography>*/}

            {/*        </Box>*/}
            {/*    </Fade>*/}
            {/*</Modal>*/}
        </Box>
    );
};

export default CustomTable;