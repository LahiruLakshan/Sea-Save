import {createTheme} from "@mui/material";

const defaultTheme = createTheme()
const theme = createTheme({
    palette: {
        primary: {
            main: "#0049d5",
            light: "#83a1c7",
        },
        secondary: {
            // main: "rgba(230,211,163,0.2)",
            main: "#cadfff",
            light: "rgb(255,255,255)"
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {

                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: '#303030',
                        },
                        // borderColor: '#a407ff',
                        // backgroundColor: "transparent",
                        // color: "#111",
                        borderRadius: "10px",
                        // height: "50px",
                        // fontFamily: "NexaRegular, sans-serif",

                    },
                    '& .MuiOutlinedInput-root.Mui-disabled': {
                        '&:hover fieldset': {
                            borderColor: '#303030',
                        },
                        // borderColor: '#a407ff',
                        // backgroundColor: "transparent",
                        color: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "10px",
                        // height: "50px",
                        // fontFamily: "NexaRegular, sans-serif",

                    },
                    '& fieldset': {
                        // borderColor: 'transparent',
                        // backgroundColor: "#ffffff",
                        // color: "#111"
                    },
                }
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    // backgroundColor: "#123",
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    background: "#0049d5",
                    color: "#ffffff",
                },
                outlinedPrimary: {
                    color: "#0049d5",
                    borderColor: "#0049d5",

                }
            }
        },
        MuiLoadingButton: {
            styleOverrides: {
                loadingIndicator: {
                    color: "#0049d5",
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    // background: "linear-gradient(-90deg, rgba(66,8,166,1) 0%, rgba(0,45,146,1) 100%)",
                    background: "#cadfff",
                    color: "#303030",
                    [defaultTheme.breakpoints.up('sm')]: {
                        padding: "0 7px"
                    }
                }
            }
        },
        MuiListItemIcon: {
            // styleOverrides:{
            defaultProps: {
                color: "#444"
            }
            // }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    // color: "#ffffff"
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#cadfff",
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                },
                elevation1: {
                    // boxShadow: "3px 3px 5px #cfcfcf,-3px -3px 5px #ffffff",
                },
                elevation2: {
                    // boxShadow: "3px 3px 5px #cfcfcf,-3px -3px 5px #ffffff",
                },
                elevation4: {
                    boxShadow: "none"   //app bar shadow
                }
            }

        },
    }
});

theme.typography.h4 = {
    fontSize: '1.2rem',
    [theme.breakpoints.up('sm')]: {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '2.4rem',
    },
};
export default theme
