import React, {useEffect, useState} from 'react';
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import logo from "../../assets/images/sea-save-logo.png";
import {makeStyles} from "@mui/styles";
import {useHistory} from "react-router-dom";
import backgroundImage from '../../assets/images/bgv2.jpg';
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../../firebase";
import {useSnackbar} from "notistack";
import {useUserContext} from "../../context/UserContext";
import {collection, onSnapshot} from "firebase/firestore";
import axios from "axios";
import {BASE_URL} from "../../config/defaults";

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
const initialFValues = {
    email: '',
}

const Login = (props) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [newPassword, setNewPassword] = useState('');
    const [requestNewPassword, setRequestNewPassword] = useState(false);

    const [values, setValues] = useState(initialFValues);
    const [userList, setUserList] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const history = useHistory();

    const { signInUser, forgotPassword } = useUserContext();


    useEffect(() => {
        axios.get(`${BASE_URL}profile/`)
            .then(response => {
                console.log("profile GET : ", response.data)

                setUserList(response.data);
            })
    }, []);

    const handleInputChange = (field, value) => {
        // const { name, value } = e.target
        setValues({
            ...values,
            [field]: value
        })
    }

    const onClick = () => {
        console.log("button submit : ", values.email)
    }

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(auth => {history.push("/user")})
            .catch(error => enqueueSnackbar("Authentication Failed", {variant:"error"}))
    }
    const onSubmit = async (e) => {
        // console.log("button submit : ", values.email)
        e.preventDefault();
        // const email = emailRef.current.value;
        // const password = psdRef.current.value;
        if (email && password) {
            console.log("adminList :", userList)
            userList.some(element => {
                if (element.email === email) {
                    if (element.type === "User") {
                        signInUser(email, password);
                    } else if (element.type === "Admin") {
                        if (element.adminApproval) {
                            signInUser(email, password);
                        } else {
                            enqueueSnackbar("Super Admin approval needed", {variant: "warning"})
                        }
                    }
                    return true;
                }

                return false;
            });

            // if (isFound) {
            //     signInUser(email, password);
            // } else {
            //     enqueueSnackbar("Invalid Email!", {variant: "error"})
            // }


            // signInUser(email, password);
        } else {
            enqueueSnackbar("Some fields empty!", {variant: "warning"})
        }
    };

    const forgotPasswordHandler = () => {
        console.log("forgotPasswordHandler ")
        if (email) {
            forgotPassword(email).then(() => {
                setEmail("");
                enqueueSnackbar("Check your email!", {variant: "success"})
            }).catch(error => enqueueSnackbar("Authentication Failed", {variant: "error"}))
        }else {
            enqueueSnackbar("Email required!", {variant: "warning"})
        }
    };
    return (
        <Box className={classes.root}>
            <Grid container direction={"row"}
                  // sx={{bgcolor:"#B6B7B7"}}
            >
                <Grid container direction={"column"} justifyContent={"center"}
                      alignItems="center" item xl={5.9} lg={5.9} md={6}
                      sm={12} xs={12}
                      sx={{
                          bgcolor:"#252525",
                          // backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                          height:"100vh"
                      }}
                >

                    <Grid item align={"center"} sx={{}}>
                        <img src={logo} style={{width:"300px"}}/>
                    </Grid>
                </Grid>
                <Grid container justifyContent="space-around"
                      item lg={5.9} md={6} sm={12} xs={12} direction={"column"}

                      sx={{
                          height: "90vh",
                          // background: "#FBFBFB",
                          borderRadius: "10px",
                          padding: "5px 50px"
                      }}>
                    {/*<Grid item align={"left"} sx={{}}>*/}
                    {/*    <img src={logo} style={{width:"300px"}}/>*/}
                    {/*</Grid>*/}
                    <Grid item align={"right"}>
                        {/*<ThemeSwitch checked={theme} setChecked={setTheme}/>*/}
                    </Grid>
                    <Grid item sx={{padding: "5px 0",}}>
                        <Typography variant={"h3"}
                                    sx={{color: "#262626", fontWeight: 500}}
                                    align={"left"}>Welcome Back!</Typography>
                        <Typography variant={"body1"}
                                    sx={{color: "#757575"}} align={"left"}>Login your
                            account</Typography>

                    </Grid>
                    <form onSubmit={onSubmit} >

                        {/* ------------------username--------------------- */}
                        <Grid container direction={"column"}>
                            <Grid item sx={{paddingTop: "20px"}}>
                                {/*<Typography sx={{color: "#7b92ec",}}>Email</Typography>*/}
                                <Grid item sx={{}}>
                                    <TextField margin="dense" id="outlined-basic"
                                               sx={{width: "100%", minWidth: "150px"}}
                                               variant="outlined"
                                               label={"Email"}
                                               value={email}
                                               onInput={(e) => setEmail(e.target.value)}/>
                                    {/*<CustomTextField/>*/}
                                </Grid>
                            </Grid>

                            {/* -----------------------passowrd---------------------------- */}

                            <Grid container item direction={"column"}>
                                <Grid item sx={{paddingTop: "20px"}}>
                                    {/*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*/}
                                    <Grid item sx={{}}>
                                        <TextField margin="dense" id="outlined-basic"
                                                   sx={{width: "100%", minWidth: "150px"}}
                                                   variant="outlined" label={"Password"}
                                                   value={password}
                                                   type={"password"}
                                                   onInput={(e) => setPassword(e.target.value)}/>
                                        {/*<CustomTextField/>*/}
                                    </Grid>
                                </Grid>
                            </Grid>


                            {requestNewPassword && <Grid container item direction={"column"}>
                                <Grid item sx={{paddingTop: "20px"}}>
                                    {/*<Typography sx={{color: "#7b92ec",}}>Password</Typography>*/}
                                    <Grid item sx={{}}>
                                        <TextField margin="dense" id="outlined-basic"
                                                   sx={{width: "100%", minWidth: "150px"}}
                                                   variant="outlined" label={"New password"}
                                                   value={newPassword}
                                                   onInput={e => setNewPassword(e.target.value)}/>
                                        {/*<CustomTextField/>*/}
                                    </Grid>
                                </Grid>
                            </Grid>}
                            {/*<FormControlLabel*/}
                            {/*    value="end"*/}
                            {/*    control={<Checkbox/>}*/}
                            {/*    label={<Typography sx={{color: "#111", paddingTop: "5px"}}>Remember*/}
                            {/*        me</Typography>}*/}
                            {/*    labelPlacement="end"*/}
                            {/*/>*/}
                            <Typography sx={{paddingTop: "20px",cursor:"pointer"}} align={"right"} onClick={forgotPasswordHandler}>Forgot Password?</Typography>

                            <Grid sx={{paddingTop: "30px"}}>
                                {/*<Button variant={"contained"} sx={{width: "100%"}}>Login</Button>*/}
                                {/*<Link to="/dashboard">*/}
                                <Button type={"submit"} variant={"contained"} color={"primary"}
                                        sx={{width: "100%", height: "50px", borderRadius: "10px"}}>Sign in</Button>
                                {/*</Link>*/}
                                <Typography onClick={props.toggleIndex} sx={{paddingTop: "20px",cursor:"pointer", textAlign:"center"}} >
                                    New user? Click here
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>

        </Box>
    );
};

export default Login;
