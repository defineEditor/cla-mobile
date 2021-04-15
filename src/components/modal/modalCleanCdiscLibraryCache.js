import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { openDB, deleteDB } from 'idb';
import { closeModal } from '../../redux/slices/ui.js';

const getStyles = makeStyles(theme => ({
    dialog: {
        paddingBottom: theme.spacing(1),
        position: 'absolute',
        borderRadius: '10px',
        top: '10%',
        transform: 'translate(0%, calc(-50%+0.5px))',
        overflowX: 'auto',
        maxHeight: '85%',
        overflowY: 'auto',
    },
    title: {
        marginBottom: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '1.25rem',
        lineHeight: '1.6',
        letterSpacing: '0.0075em',
    },
}));

const ModalCleanCdiscLibraryCache = (props) => {
    const [endpointsCount, setEndpointsCount] = useState(null);
    const dispatch = useDispatch();
    const classes = getStyles();

    useEffect(() => {
        const getInfo = async () => {
            const db = await openDB('cdiscLibrary-store', 1, {
                upgrade (db) {
                    // Create a store of objects
                    db.createObjectStore('cdiscLibrary', {});
                },
            });

            const count = await db.count('cdiscLibrary');

            setEndpointsCount(count);
        };
        getInfo();
    }, []);

    const onDelete = async () => {
        dispatch(closeModal({ type: props.type }));
        await deleteDB('cdiscLibrary-store');
    };

    const onCancel = () => {
        dispatch(closeModal({ type: props.type }));
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            open
            PaperProps={{ className: classes.dialog }}
            tabIndex='0'
        >
            <DialogTitle id="alert-dialog-title" className={classes.title} disableTypography>
                Clean CDISC Library Cache
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    { endpointsCount > 0 && (
                        `You have ${endpointsCount} endpoints saved in your cache. Are you sure you want to delete them?`
                    )}
                    { endpointsCount <= 0 && (
                        'There are no saved endpoints.'
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onDelete}
                    color="primary"
                    disabled={endpointsCount <= 0}
                >
                    Delete
                </Button>
                <Button onClick={onCancel} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ModalCleanCdiscLibraryCache.propTypes = {
    type: PropTypes.string.isRequired,
};

export default ModalCleanCdiscLibraryCache;
