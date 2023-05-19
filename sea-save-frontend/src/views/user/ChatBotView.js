import React from 'react';
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import ChatBot from "react-simple-chatbot";
import {ThemeProvider} from 'styled-components';
import {Grid} from "@mui/material";
import CustomFooter from "../../components/footer/CustomFooter";

const ChatBotView = () => {

    const theme = {
        background: '#f5f8fb',
        fontFamily: 'Roboto',
        headerBgColor: '#0265A9',
        headerFontColor: '#fff',
        headerFontSize: '15px',
        botBubbleColor: '#0265A9',
        botFontColor: '#fff',
        userBubbleColor: '#fff',
        userFontColor: '#4a4a4a',
    };

    const steps = [
        {
            id: "Greet",
            message: "Hello, Welcome to our shop",
            trigger: "Done",
        },
        {
            id: "Done",
            message: "Please enter your name!",
            trigger: "waiting1",
        },
        {
            id: "waiting1",
            user: true,
            trigger: "Name",
        },
        {
            id: "Name",
            message: "Hi {previousValue}, Please select your issue",
            trigger: "issues",
        },
        {
            id: "issues",
            options: [
                {
                    value: "React",
                    label: "React",
                    trigger: "React",
                },
                {
                    value: "Angular",
                    label: "Angular",
                    trigger: "Angular"
                },
                {
                    value: "Malith",
                    label: "Malith",
                    trigger: "Malith"
                },
            ],
        },
        {
            id: "React",
            message:
                "Thanks for letting your React issue, Our team will resolve your issue ASAP",
            end: true,
        },
        {
            id: "Angular",
            message:
                "Thanks for letting your Angular issue, Our team will resolve your issue ASAP",
            end: true,
        },
        {
            id: "Malith",
            message:
                "hdisd d dsf d d ds ",
            end: true,
        },
    ];

    return (
        <>
            <ResponsiveAppBar/>
            <Grid container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2} paddingY={2} sx={{height:"100vh"}}>
                <ThemeProvider theme={theme}>
                    <ChatBot steps={steps} />
                </ThemeProvider>
            </Grid>
            <CustomFooter/>
        </>
    );
};

export default ChatBotView;
