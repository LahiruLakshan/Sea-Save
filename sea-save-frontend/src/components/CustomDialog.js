import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {Button, DialogActions, DialogContent} from "@mui/material";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const CustomDialog = (props) => {
    const {children, title, onClose, closeBtn, fullScreen, fullWidth,  footer, open, ...other} = props;
    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={fullWidth}
            open={open}
            onClose={onClose}
            scroll={"paper"}
            maxWidth={"100vw"}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            TransitionComponent={Transition}
        >
            <DialogTitle sx={{m: 0, p: 2}} {...other} >
                {title}
                {onClose && closeBtn ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                ) : null}
            </DialogTitle>
            <DialogContent
                dividers={true}>
                {children}
            </DialogContent>
            {footer && <DialogActions>
                <Button autoFocus onClick={onClose} variant={"contained"}>
                    Done
                </Button>
            </DialogActions>}
        </Dialog>
    );
};

export default CustomDialog;
