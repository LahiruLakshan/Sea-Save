import {styled} from "@mui/material/styles";
import {Paper} from "@mui/material";

export const BoxWithoutShadow = styled('div')(({theme}) => ({

    minHeight: "100vh",
    display: "flex",
    margin: "auto",
    // backgroundColor: customTheme.palette.secondary.main,
    [theme.breakpoints.only('xl')]: {
        width: "80vw",
    },
    [theme.breakpoints.only('lg')]: {
        width: "80vw",
    },
    [theme.breakpoints.only('md')]: {
        width: "70vw",
    },
    [theme.breakpoints.only('sm')]: {
        width: "80vw",
    },
    [theme.breakpoints.only('xs')]: {
        width: "90vw",
    },
    // margin: "12px"
}));

export const BoxWithShadow = styled(Paper)(({theme}) => ({

    // minHeight: "100vh",
    display: "flex",
    margin: "auto",
    [theme.breakpoints.only('xl')]: {
        width: "80vw",
    },
    [theme.breakpoints.only('lg')]: {
        width: "80vw",
    },
    [theme.breakpoints.only('md')]: {
        width: "70vw",
    },
    [theme.breakpoints.only('sm')]: {
        width: "80vw",
    },
    [theme.breakpoints.only('xs')]: {
        width: "90vw",
    },
    // margin: "12px"
}));
