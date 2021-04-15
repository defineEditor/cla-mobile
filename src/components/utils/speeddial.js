import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import HomeIcon from '@material-ui/icons/Home';
import SaveIcon from '@material-ui/icons/Save';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import MoreVert from '@material-ui/icons/MoreVert';
import Close from '@material-ui/icons/Close';
import Settings from '@material-ui/icons/Settings';
import saveState from './../../utils/saveState.js';
import { changePage } from '../../redux/slices/ui.js';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
    },
    speedDial: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
    },
}));

export default function SpeedDials () {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const futureLength = useSelector(state => state.future.length);
    const pastLength = useSelector(state => state.past.length);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const goHome = () => {
        dispatch(changePage({ page: 'products' }));
        handleClose();
    };

    const goSettings = () => {
        dispatch(changePage({ page: 'settings' }));
        handleClose();
    };

    const save = () => {
        saveState();
        handleClose();
    };

    const redo = () => {
        dispatch(ActionCreators.redo());
    };

    const undo = () => {
        dispatch(ActionCreators.undo());
    };

    const actions = [
        { icon: <SaveIcon />, name: 'Save', onClick: save },
        { icon: <HomeIcon />, name: 'Home', onClick: goHome },
        { icon: <Settings />, name: 'Settings', onClick: goSettings },
        { icon: <ChevronRight />, name: 'Redo', onClick: redo, disabled: futureLength === 0 },
        { icon: <ChevronLeft />, name: 'Undo', onClick: undo, disabled: pastLength === 0 },
    ];

    return (
        <div className={classes.root}>
            <SpeedDial
                ariaLabel='SpeedDial'
                className={classes.speedDial}
                icon={<SpeedDialIcon openIcon={<Close />} icon={<MoreVert />} />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                direction='down'
                FabProps={{ size: 'small' }}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={action.onClick}
                        FabProps={{ disabled: action.disabled }}
                    />
                ))}
            </SpeedDial>
        </div>
    );
}
