import {makeStyles} from "@mui/styles";
import * as React from 'react';
import {useEffect, useState} from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Link, useHistory, useLocation} from "react-router-dom";
import logo from "../../assets/images/sea-save-logo.png";
import {Avatar, Grid} from "@mui/material";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Toolbar from "@mui/material/Toolbar";
import customTheme from "../../theme";
import {auth, db} from "../../firebase";
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SecurityIcon from '@mui/icons-material/Security';
import {collection, onSnapshot} from "firebase/firestore";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

const drawerWidth = 270
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    height: "100px",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    height: "100px",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);
const useStyles = makeStyles((theme) => {
    return {
        appBar: {
            transform: "translateZ(500px)",
            boxShadow: "none",
            transition: " 0.5s ease",
        },
        setAppBar: {
            boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
            transform: "translateZ(-500px)",
            // background:"rgba(255,255,255,0.2)",
            // filter:"blur(4px)",
            // background: "linear-gradient(-90deg, rgba(66,8,166,1) 0%, rgba(0,45,146,1) 100%)",
            // backdropFilter: "blur(4px)",
            transition: " 0.5s ease",
        },
        text:{
            color: "#000000"
        },
        setText:{
            color: "#ffffff"
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            minHeight: '100px',
            ...theme.mixins.toolbar,
        },
        footer: {
            position: "relative",
            left: 0,
            bottom: 0,
            width: "100%",
            textAlign: "center",
        },
        bodyCus: {
            minHeight: "80vh"
        }
    }
})


const DashboardLayout = (props) => {
    const {children, name, role} = props;
    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [valueCheck, setValueCheck] = useState(false);
    const [headerBackground, setHeaderBackground] = useState("appBar");
    const [text, setText] = useState("text");
    // const [adminList, setAdminList] = useState([]);
    // const [name, setName] = useState("Name");
    // const [role, setRole] = useState("Role");

    const headerBackgroundRef = React.useRef();
    headerBackgroundRef.current = headerBackground;

    const textRef = React.useRef();
    textRef.current = text;
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const onChange = (value) => {
        console.log(value);
        if (value){
            setValueCheck(true);

        }else {
            setValueCheck(false);
        }
    };

    // useEffect(() => {
    //     const adminRef = collection(db, "admin");
    //     onSnapshot(
    //         adminRef,
    //         (snapShot) => {
    //             let list = [];
    //             snapShot.docs.forEach((doc) => {
    //                 list.push({id: doc.id, ...doc.data()});
    //             });
    //             setAdminList(list);
    //         },
    //         (error) => {
    //             console.log(error);
    //         }
    //     )
    //
    // }, []);
    //
    // useEffect(() =>{
    //     if (adminList.length) {
    //         console.log("Admin List : ", adminList)
    //         adminList.some(element => {
    //             if (element.email === auth.currentUser.email){
    //                 setName(element.username);
    //                 setRole(element.role)
    //             }
    //         })
    //         console.log("auth.currentUser : ", auth.currentUser.email)
    //     }
    // },[adminList])

    const menuItems = [
        {
            text: <Typography variant={"h5"}>{name}</Typography>,
            secondaryText: <Typography variant={"caption"}>{role}</Typography>,
            icon: <Avatar src={logo} sx={{marginRight: "20px", right: "7px"}}/>,
            // path: '/profile',
            title: 'User Profile'
        },
        {
            text: 'User Management',
            secondaryText: "",
            icon: <PeopleAltRoundedIcon/>,
            path: '/user',
            title: 'User Management'
        },
        // {
        //     text: 'Dashboard',
        //     secondaryText: "",
        //     icon: <DashboardRounded/>,
        //     path: '/dashboard',
        //     title: 'Dashboard'
        // },

        {
            text: 'Challenge Management',
            secondaryText: "",
            icon: <AssignmentRoundedIcon/>,
            path: '/challenge',
            title: 'Challenge Management'
        },
        {
            text: 'Animal Profile',
            secondaryText: "",
            icon: <PhotoLibraryIcon/>,
            path: '/animal',
            title: 'Animal Profile'
        },
        {
            text: 'Forum Management',
            secondaryText: "",
            icon: <SecurityIcon/>,
            path: '/forum',
            title: 'Forum Management'
        },
        // {
        //     text: 'AnimalProfile',
        //     secondaryText: "",
        //     icon: <PermMediaRoundedIcon/>,
        //     path: '/animal',
        //     title: 'AnimalProfile'
        // },
        // role === "Super Admin" && {
        //     text: 'Admin',
        //     secondaryText: "",
        //     icon: <PersonIcon/>,
        //     path: '/register',
        //     title: 'Create New Admin'
        // },

    ];

    useEffect(() => {

        const handleScroll = () => {
            const show = window.scrollY > 0;
            if (show) {
                setHeaderBackground("setAppBar");
                // setText("setText");
                console.log(show)
            } else {
                setHeaderBackground("appBar");
                setText("text");
                console.log(show)
            }


        }
        document.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <Box sx={{display: 'flex', }}>
            <CssBaseline/>

            <AppBar position="fixed" open={open} >
                <Toolbar sx={{eight: "100px", bgcolor: customTheme.palette.secondary.main }} className={classes[headerBackgroundRef.current]}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: '36px',
                            ...(open && {display: 'none'}),
                        }}
                    >
                        {/*<MenuRoundedIcon sx={{color:window.scrollY > 0? "#1FA394":"#cbd4e8"}}/>*/}
                        <MenuRoundedIcon sx={{ color:"#303030"}}/>
                    </IconButton>
                    <Grid direction={"column"}
                          sx={{flexGrow: 1, p: {sm: 2, md: 5}, display: {xs: 'none', sm: 'block'}}}>
                        <Typography variant={"caption"} noWrap component="div" sx={{color: "#111"}}>
                            Hello Admin, Welcome back!
                        </Typography>
                        {menuItems.map((item) => (
                            (location.pathname === item.path) ?
                                <Typography variant={"h4"} noWrap component="div" className={classes[textRef.current]}>
                                    {item.title}
                                </Typography> : ""
                        ))}

                        {
                            (location.pathname === "/") ?
                                <Typography variant={"h4"} noWrap component="div" className={classes[textRef.current]}>
                                    User Management
                                </Typography> : ""
                        }

                    </Grid>
                </Toolbar>
            </AppBar>


            <Drawer variant="permanent" open={open}>
                <DrawerHeader sx={{justifyContent: "space-around", paddingTop:"50px"}}>
                    {open && <img src={logo} width={150} />}
                    {open && <IconButton sx={{backgroundColor: "rgba(0,0,0,0.24)", color:"#303030"}} onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>}
                </DrawerHeader>
                {/*<Divider/>*/}
                <List>
                    <Grid sx={{paddingTop: "20%"}}>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => {
                                    history.push(item.path);
                                    console.log("click : ", children);
                                }}
                                sx={{
                                    borderRadius: "10px",
                                    marginY: "10px",
                                    backgroundColor: location.pathname === item.path ? "rgba(49,49,49,0.24)" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.24)",
                                    }
                                }}
                            >
                                <ListItemIcon sx={{color:"#303030"}}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} secondary={item.secondaryText}/>
                            </ListItem>
                        ))}
                    </Grid>
                    <Grid sx={{paddingTop: "90px"}}>

                        <ListItem
                            button
                            to="/home"
                            component={Link}
                            onClick={() => {
                                history.push("/home");
                            }}
                            sx={{
                                borderRadius: "10px",
                                marginY: "10px",
                                backgroundColor: "#252525",
                                color:theme.palette.primary.light,
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                }
                            }}>
                            <ListItemIcon sx={{color:theme.palette.primary.light}}><HomeRoundedIcon/></ListItemIcon>
                            <ListItemText primary={"Back To Home"}/>
                        </ListItem>

                        <ListItem
                            button
                            to="/"
                            component={Link}
                            onClick={() => {
                                auth.signOut();
                                history.push("/logout");
                            }}
                            sx={{
                                borderRadius: "10px",
                                marginY: "10px",
                                backgroundColor: "#252525",
                                color:theme.palette.primary.light,
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                }
                            }}>
                            <ListItemIcon sx={{color:theme.palette.primary.light}}><LogoutRoundedIcon/></ListItemIcon>
                            <ListItemText primary={"Logout"}/>
                        </ListItem>

                    </Grid>
                </List>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 5, bgcolor:"#ffffff"}}>
                {/*<div className={classes.toolbar}/>*/}
                <DrawerHeader/>
                <div className={classes.bodyCus}>
                    {children}
                </div>
                <div className={classes.footer}>
                    <Typography variant="body2" color="textSecondary" align="center">Copyright © 2022. All rights reserved by Sea Save</Typography>
                </div>
            </Box>
        </Box>
    );
};


export default DashboardLayout;
