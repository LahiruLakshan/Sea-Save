import React from 'react';
import {Container, Grid, Paper} from "@mui/material";
import {makeStyles} from "@mui/styles";
import LineGraph from "../../components/LineGraph";
import * as PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        // backgroundColor: "#123421",
        padding: "40px",
    },
    pieChart: {
        backgroundColor: "#00b9ef",
    },
    paper: {
        display: "inline-block",
        // width: "100%",
        // height: "100%",
        margin: theme.spacing(2),
        padding: theme.spacing(1),
        // padding: theme.spacing(2),
    },
    box: {
        backgroundColor: "#ffffff",
        // transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        padding: "20px",
        borderRadius: "20px",
    },
    container: {
        // padding: theme.spacing(1),
        backgroundColor: "#855aa6",
    },
    vipLogo: {
        height: 80,
        width: 80,
        background: "#fff",
        marginRight: theme.spacing(2),
    },
    topic: {
        color: "#707070",
        fontSize: 15,
    },
}))

const lineData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
    datasets: [
        {
            label: "On-boarding",
            data: [1, 2, 2, 4, 6,7, 6, 9, 9, 11, 11, 12, 14, 14, 15],
            fill: true,
            backgroundColor: "rgba(183,33,255,0.2)",
            borderColor: "rgba(183,33,255)",
            // yAxisID: 'y-axis-1',
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
        },
        {
            label: "Off-boarding",
            data: [0, 2, 3, 5, 7,8, 7,7, 8, 10, 12, 12, 12, 14, 16],
            fill: true,
            backgroundColor: "rgba(25,118,210,0.2)",
            borderColor: "#1976D2",
            // yAxisID: 'y-axis-2',
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
        },
    ],
}
const options = {
    maintainAspectRatio: false,
    responsive: true,
}

function Line(props) {
    return null;
}

Line.propTypes = {data: PropTypes.shape({datasets: PropTypes.any, labels: PropTypes.arrayOf(PropTypes.string)})};
const Dashboard = () => {
    const classes = useStyles()
    return (
        <Container className={classes.root}>
            {/*<Grid container direction={"row"} justifyContent="space-between"*/}
            {/*      alignItems="center"*/}
            {/*>*/}
            {/*    <Grid  direction="column" justifyContent="center" alignItems="center" item lg={5} md={5} xs={5}*/}
            {/*          // className={classes.paper}*/}
            {/*          component={Paper}*/}
            {/*    >*/}
            {/*            <Grid container direction="column" justifyContent="center" alignItems="center" item>*/}
            {/*                <Typography variant="body1" className={classes.topic} align={"center"}>*/}
            {/*                    Joiners for this year*/}
            {/*                </Typography>*/}
            {/*                <Typography variant="h4">10</Typography>*/}
            {/*            </Grid>*/}
            {/*    </Grid>*/}
            {/*    <Grid  direction="column" justifyContent="center" alignItems="center" item lg={5} md={5} xs={5}*/}
            {/*          // className={classes.paper}*/}
            {/*          component={Paper}*/}
            {/*    >*/}
            {/*            <Grid container direction="column" justifyContent="center" alignItems="center" item*/}
            {/*            >*/}
            {/*                <Typography variant="body1" className={classes.topic} align={"center"}>*/}
            {/*                    Leavers for this year*/}
            {/*                </Typography>*/}
            {/*                <Typography variant="h4">15</Typography>*/}
            {/*            </Grid>*/}
            {/*        </Grid>*/}

            {/*</Grid>*/}
            {/*<Grid container direction="row" marginY={2}>*/}
            {/*    <Grid direction="column" justify="center" alignItems="center" item lg={12} md={12} sm={12} xs={12}*/}
            {/*        className={classes.paper}*/}
            {/*        component={Paper}*/}
            {/*    >*/}
            {/*        <Line data={lineData} />*/}
            {/*    </Grid>*/}
            {/*</Grid>*/}

            {/*<Grid container direction="row" marginY={2}>*/}
            {/*    <Grid  direction="column" justifyContent="center" alignItems="center" item lg={12} md={12} xs={12}*/}
            {/*        // className={classes.paper}*/}
            {/*        //    component={Paper}*/}
            {/*    >*/}
            {/*        /!*<Line data={lineData}  className={"custom-canvas"}/>*!/*/}
            {/*        <LineGraph/>*/}
            {/*    </Grid>*/}
            {/*</Grid>*/}
        </Container>
    );
};

export default Dashboard;
