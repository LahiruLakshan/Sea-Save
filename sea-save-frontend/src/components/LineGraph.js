import React from 'react';
import {Line} from "react-chartjs-2";

const lineData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
    datasets: [
        {
            label: "On-boarding",
            data: [1, 2, 2, 4, 6,7, 6, 9, 9, 11, 11, 12, 14, 14, 15],
            fill: true,
            backgroundColor: "rgba(0,183,74,0.2)",
            borderColor: "rgb(0,183,74)",
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
            backgroundColor: "rgba(48,48,48,0.2)",
            borderColor: "#303030",
            // yAxisID: 'y-axis-2',
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
        },
    ],
}

const LineGraph = () => {
    return (
        <div>
            <Line data={lineData}  className={"custom-canvas"}/>
        </div>
    );
};

export default LineGraph;
