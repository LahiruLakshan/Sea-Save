import React from 'react';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Fab, FormControl, InputBase, InputLabel, MenuItem, Select} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {styled} from "@mui/styles";
import AddIcon from '@mui/icons-material/Add';

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#efefef",
    '&:hover': {
        backgroundColor: "#e3e3e3",
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const EnhancedTableToolbar = (props) => {
    const {tableName, headButton, requestSearch, filter, handleChange, menuItems, ModalPopup} = props;
    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},

            }}
        >
            <Typography
                sx={{flex: '1 1 100%'}}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                {tableName}
            </Typography>
            <>
                {/*<Button onClick={handleOpen} variant={"outlined"} sx={{width: "200px"}}*/}
                {/*        startIcon={<AddCircleTwoToneIcon/>}>Add*/}
                {/*    Employee</Button>*/}
                {headButton && <Box sx={{minWidth: 150}} mr={2}>
                    <Fab color="primary" aria-label="add" onClick={ModalPopup} variant={"extended"}>
                        <AddIcon sx={{ mr: 1 }}/>
                        {headButton}
                    </Fab>
                    {/*<Button startIcon={<AddCircleOutlineRoundedIcon />} onClick={ModalPopup} variant={"contained"} fullWidth size={"small"} sx={{height: 40, borderRadius:1}}>*/}
                    {/*    {headButton}</Button>*/}
                </Box>}
                {menuItems && <Box sx={{minWidth: 250}} mr={1}>
                    <FormControl sx={{minWidth: 250}} size={"small"}>
                        <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            label="Age"
                            onChange={handleChange}
                        >
                            {menuItems.map((item) =>
                                <MenuItem key={item.id} value={item.value}>{item.text}</MenuItem>
                            )}

                        </Select>
                    </FormControl>
                </Box>}
                {requestSearch && <Search>
                    <SearchIconWrapper>
                        <SearchIcon/>
                    </SearchIconWrapper>
                    <StyledInputBase
                        type={"search"}
                        placeholder="Search…"
                        inputProps={{'aria-label': 'search'}}
                        onChange={(searchVal) => requestSearch(searchVal)}
                    />
                </Search>}
            </>
        </Toolbar>
    );
};

export default EnhancedTableToolbar;
