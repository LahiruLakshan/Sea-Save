import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {red} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import imageLogo from '../../../assets/images/bgv2.jpg'
import {Button, Grid} from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import CreateForum from "../forum/CreateForum";
import axios from "axios";
import {BASE_URL} from "../../../config/defaults";
import {useSnackbar} from "notistack";
import {useEffect, useState} from "react";

const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const AnimalCard = ({data}) => {
    const [expanded, setExpanded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [rowData, setRowData] = React.useState("");

    const handleClose = () => setOpen(false);

    const handleEditClose = () => setOpenEdit(false);
    const handleOpen = (row) => {
        console.log("setRowData : ", row);
        setRowData(row);
        setOpenEdit(true);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [imageHeight, setImageHeight] = useState(0);

    useEffect(() => {
        const calculateHeight = () => {
            const img = new Image();
            img.onload = () => {
                setImageHeight(img.height);
            };
            img.src = data?.imageUrl;
        };


        calculateHeight();
    }, [data?.imageUrl]);
        return (
        <>
            <Card sx={{width: "75vw"}}>
                <CardHeader
                    // avatar={
                    //     <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    //         R
                    //     </Avatar>
                    // }
                    // action={
                    //     <IconButton aria-label="settings">
                    //         <MoreVertIcon />
                    //     </IconButton>
                    // }
                    title={<Typography variant="h6" color="text.secondary">
                        {data?.name}
                    </Typography>}
                />
                <CardMedia
                    component="img"
                    height={imageHeight}
                    image={data?.imageUrl}
                    alt="Paella dish"
                />
                <CardContent>
                    <Typography variant="body2" sx={{color:"#000"}}>
                        Main Threat
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data?.mainThreat}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>

                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon/>
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" sx={{color:"#000"}}>
                            Description
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {data?.description}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>

        </>
    );
};

export default AnimalCard;
