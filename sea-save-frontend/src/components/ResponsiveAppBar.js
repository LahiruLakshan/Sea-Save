import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {useHistory} from "react-router-dom";
import logo from "../assets/images/sea-save-logo.png";
import {auth} from "../firebase";
import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "../config/defaults";



function ResponsiveAppBar() {
    const history = useHistory()
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [userList, setUserList] = useState([]);
    const [name, setName] = useState("Name");
    const [role, setRole] = useState("Role");
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        axios.get(`${BASE_URL}profile/`)
            .then(response => {
                console.log("profile GET : ", response.data)

                setUserList(response.data);
            })

    }, []);
    useEffect(() => {
        if (userList.length) {
            console.log("Admin List : ", userList)
            userList.some(element => {
                if (element.email === auth.currentUser.email) {
                    setName(element.name);
                    setRole(element.type);
                    setUserData(element);
                }
            })
            console.log("auth.currentUser : ", auth.currentUser.email)
        }
    }, [userList])

    const pages = [
        {name: 'Home', route: "/home"},
        {name: 'Challenge', route: "/challenge_view"},
        {name: 'Profile', route: "/animal_profile"},
        {name: 'ChatBot', route: "/chat_bot"},
    ];
    const settings = [
        {name: 'Home', route: "/home"},
        {name: 'Challenge', route: "/challenge_view"},
        {name: 'Profile', route: "/animal_profile"},
        {name: 'ChatBot', route: "/chat_bot"},
        (role === "Admin" || role === "Super Admin") ? { name: 'Dashboard', route: "/user" } : {},
        {name: 'Log Out', route: "/logout"},

    ];

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (path) => {

        console.log("handleCloseNavMenu")
        if (path !== ""){
            history.push(path);
        }
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (path) => {
        if (path === "/logout"){
            console.log("logout")
                auth.signOut();
                history.push("/logout");

        } else if (path !== ""){
            history.push(path);
        }
        setAnchorElUser(null);
    };

    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                        <img src={logo} width={150}/>
                    </Box>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClick={() => handleCloseNavMenu("")}
                            open={Boolean(anchorElNav)}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={() => handleCloseNavMenu(page.route)}>
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}>
                        <img src={logo} width={150}/>
                    </Box>

                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => handleCloseNavMenu(page.route)}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting.route)}>
                                    <Typography textAlign="center">{setting.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
