import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    Grid, InputAdornment,
    InputLabel,
    MenuItem, OutlinedInput,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {makeStyles} from '@mui/styles';
import 'react-phone-input-2/lib/material.css';
import logo from "../../assets/images/icon.png";
import {useHistory} from "react-router-dom";
import theme from "../../theme";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../../firebase";
import {useUserContext} from "../../context/UserContext";
import {useSnackbar} from "notistack";
import {addDoc, collection, onSnapshot} from "firebase/firestore";
import axios from "axios";
import {BASE_URL} from "../../config/defaults";
import PhoneInput from "react-phone-input-2";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({

    root: {
        flexGrow: 1,
        height: "100vh",

        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    },
    test: {
        [theme.breakpoints.only('xl')]: {
            padding: "5px 150px",
            minHeight: "100vh",
        },
        [theme.breakpoints.only('lg')]: {
            padding: "5px 100px",
            minHeight: "100vh",
        },
        [theme.breakpoints.only('md')]: {
            padding: "5px 100px",
            minHeight: "100vh",
        },
        [theme.breakpoints.only('sm')]: {
            padding: "50px 150px",
            minHeight: "50vh",
        },
        [theme.breakpoints.only('xs')]: {
            padding: "20px 50px",
        },
    },
}))
const Register = (props) => {
    const history = useHistory();
    const [loading, setLoading] = React.useState(false);

    const classes = useStyles()
    const [username, setUsername] = useState();
    const [contactNo, setContactNo] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const {registerUser} = useUserContext();
    const [type, setType] = useState("");
    const [userList, setUserList] = useState([]);
    const [showPassword, setShowPassword] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const register = () => {
        console.log(email);
        console.log(password);
        createUserWithEmailAndPassword(auth, email, password)
            .then(e => {
                console.log("Auth", e)

            })
            .catch(error => console.log(error))
    }
    useEffect(() => {

        axios.get(`${BASE_URL}profile/`)
            .then(response => {
                console.log("profile GET : ", response.data)

                setUserList(response.data);
            })

    }, []);
    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (email && password && username) {

            const isFound = userList.some(element => {
                if (element.email === email) {
                    return true;
                }

                return false;
            });

            if (isFound) {
                enqueueSnackbar("Already Registered!", {variant: "error"})
            } else {
                await registerUser(email, password, username);
                console.log("register finished")

                const formData = {
                    name: username,
                    email: email,
                    contactNo: contactNo,
                    password: password,
                    type: type,
                    adminApproval: type !== "Admin"
                }

                await axios.post(`${BASE_URL}profile/create`, formData)
                    .then((res) => {
                        console.log("profile create RES : ", res)
                        console.log("register finished")
                        setUsername("")
                        setEmail("")
                        setType("")
                        setLoading(false);
                    }).catch((err) => {
                        console.log("profile create ERRor : ", err)
                    })

                // await addDoc(collection(db, "user"), {
                //     username: username.trim(),
                //     email: email.trim(),
                //     type: type,
                //     adminApproval: type !== "Admin"
                // }).then(() => {
                //     console.log("register finished")
                //     setUsername("")
                //     setEmail("")
                //     setType("")
                //     setLoading(false);
                // })
                await auth.signOut().then(() => history.push("/home"))

            }

        } else {
            enqueueSnackbar("Some fields empty!", {variant: "warning"})
        }
    };


    return (
        <Box sx={{borderRadius: 0, justifyContent: "center", alignItems: "center", display: "flex"}}>
            <Grid container direction={"row"} justifyContent={"center"}>
                {/*<Grid container direction={"column"} justifyContent={"center"} alignItems="center" item lg={6} md={6}*/}
                {/*      sm={12} xs={12} sx={{*/}
                {/*    backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover',*/}
                {/*    backgroundRepeat: 'no-repeat',*/}
                {/*    minHeight: "50vh !important",*/}
                {/*}}>*/}
                {/*    <Grid item>*/}


                {/*    </Grid>*/}
                {/*</Grid>*/}
                <Grid container justifyContent="space-around" className={classes.test} component={Paper}
                      item lg={6} md={6} sm={12} xs={12}
                      direction={"column"} sx={{

                    background: theme.palette.secondary.light,
                    // padding: "5px 150px"
                }}>
                    <Grid item align={"left"} sx={{}}>
                        <img src={logo} style={{width: "300px"}}/>
                    </Grid>
                    <Grid item sx={{padding: "5px 0",}}>
                        <Typography variant={"h3"}
                                    sx={{color: "#262626", fontWeight: 500}}
                                    align={"left"}>Registration</Typography>
                        <Typography variant={"body1"}
                                    sx={{color: "#757575"}} align={"left"}>Create new
                            account</Typography>

                    </Grid>
                    <Grid container direction={"column"}>
                        <form onSubmit={onSubmit}>
                            <Grid container item direction={"row"}>
                                <Grid item xs={12} sx={{paddingTop: "20px"}}>
                                    <TextField margin="dense" id="outlined-basic"
                                               sx={{width: "100%", minWidth: "150px"}}
                                               variant="outlined"
                                               label={"Username"}
                                               value={username}
                                               onInput={(e) => setUsername(e.target.value)}/>
                                </Grid>
                                {/*<Grid item xl={1} lg={1} sm={1}/>*/}
                                {/*<Grid item xl={5.5} lg={5.5} md={12} sm={5.5} xs={12} sx={{paddingTop: "20px"}}>*/}
                                {/*    <TextField margin="dense" id="outlined-basic"*/}
                                {/*               sx={{width: "100%", minWidth: "150px"}}*/}
                                {/*               variant="outlined"*/}
                                {/*               label={"Last Name"}*/}
                                {/*               value={lastName}*/}
                                {/*               onInput={(e) => setLastName(e.target.value)}/>*/}
                                {/*</Grid>*/}
                            </Grid>
                            <Grid item sx={{paddingTop: "20px"}}>
                                <TextField margin="dense" id="outlined-basic"
                                           sx={{width: "100%", minWidth: "150px"}}
                                           variant="outlined"
                                           label={"Email"}
                                           value={email}
                                           onInput={(e) => setEmail(e.target.value)}/>
                            </Grid>

                            {/* -----------------------Type---------------------------- */}

                            <Grid container item direction={"column"}>
                                <Grid item sx={{paddingTop: "20px"}}>
                                    <FormControl margin="dense" fullWidth>
                                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                        <Select sx={{width: "100%", minWidth: "150px", borderRadius: "10px"}}
                                                variant="outlined"
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={type}
                                                label="Type"
                                                onChange={(e) => {
                                                    setType(e.target.value);
                                                }}
                                        >

                                            <MenuItem key={1} value={"User"}>User</MenuItem>
                                            <MenuItem key={2} value={"Admin"}>Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container item direction={"row"}>
                                <Grid item lg={12} md={12} sm={12} xs={12} sx={{paddingTop: "20px"}}>
                                    <TextField margin="dense" id="outlined-basic"
                                               sx={{width: "100%", minWidth: "150px"}}
                                               variant="outlined"
                                               label={"ContactNo"}
                                               value={contactNo}
                                               onInput={(e) => setContactNo(e.target.value)}/>
                                </Grid>
                            </Grid>

                            <Grid container item direction={"column"}>
                                <Grid item sx={{paddingTop: "20px"}}>
                                    {/*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*/}
                                    <Grid item sx={{}}>
                                        <FormControl sx={{width: "100%", minWidth: "150px"}} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                                onInput={(e) => setPassword(e.target.value)}
                                                value={password}
                                                sx={{borderRadius:"10px"}}
                                                id="outlined-adornment-password"
                                                type={showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/*<Grid container item direction={"row"}>*/}
                            {/*    <Grid item lg={12} md={12} sm={12} xs={12} sx={{paddingTop: "20px"}}>*/}
                            {/*        <TextField margin="dense" id="outlined-basic"*/}
                            {/*                   sx={{width: "100%", minWidth: "150px"}}*/}
                            {/*                   variant="outlined"*/}
                            {/*                   label={"Password"}*/}
                            {/*                   value={password}*/}
                            {/*                   onInput={(e) => setPassword(e.target.value)}/>*/}
                            {/*    </Grid>*/}
                            {/*</Grid>*/}
                            <Grid sx={{paddingY: "30px"}}>
                                {/*<Button variant={"contained"} sx={{width: "100%"}}>Login</Button>*/}
                                {/*<Link to="/dashboard">*/}
                                <Button type={"submit"} variant={"contained"} color={"primary"}
                                        sx={{width: "100%", height: "50px", borderRadius: "10px"}}>Sign up</Button>
                                {/*</Link>*/}
                                <Typography onClick={props.toggleIndex} sx={{paddingTop: "20px",cursor:"pointer", textAlign:"center"}} >
                                    Already have an account? Click here
                                </Typography>
                            </Grid>

                        </form>
                    </Grid>
                </Grid>
            </Grid>

        </Box>
    );
};

export default Register;
