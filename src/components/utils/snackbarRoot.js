import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import { amber, green } from '@material-ui/core/colors';
import { closeSnackbar } from '../../redux/slices/ui.js';

const getStyles = makeStyles(theme => ({
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    snackbar: {
        marginBottom: theme.spacing(2),
    },
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
        marginRight: theme.spacing(1),
    },
}));

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const SnackbarRoot = () => {
    const dispatch = useDispatch();
    const snackbar = useSelector(state => state.present.ui.snackbar);
    if (snackbar.type === null) {
        return null;
    }
    const classes = getStyles();
    const duration = snackbar.props.duration || 3000;
    const Icon = variantIcon[snackbar.type];

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open
            autoHideDuration={duration}
            onClose={() => dispatch(closeSnackbar())}
            className={classes.snackbar}
        >
            <SnackbarContent
                message={
                    <span id="snackbar" className={classes.message}>
                        <Icon className={classes.icon} />
                        {snackbar.message}
                    </span>
                }
                className={classes[snackbar.type]}
            />
        </Snackbar>
    );
};

export default SnackbarRoot;
