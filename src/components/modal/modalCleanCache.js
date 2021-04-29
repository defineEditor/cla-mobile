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
        width: '90%',
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

const ModalCleanCache = (props) => {
    const [endpointsCount, setEndpointsCount] = useState(null);
    const dispatch = useDispatch();
    const classes = getStyles();
    const cacheType = props.cacheType;

    let dbName;
    let storeName;
    if (cacheType === 'cdiscLibrary') {
        dbName = 'cdiscLibrary-store';
        storeName = 'cdiscLibrary';
    } else if (cacheType === 'controlledTerminology') {
        dbName = 'ct-store';
        storeName = 'controlledTerminology';
    }

    useEffect(() => {
        const getInfo = async () => {
            const db = await openDB(dbName, 1, {
                upgrade (db) {
                    // Create a store of objects
                    db.createObjectStore(storeName, {});
                },
            });

            const count = await db.count(storeName);

            setEndpointsCount(count);
        };
        getInfo();
    }, [dbName, storeName]);

    const onDelete = async () => {
        dispatch(closeModal({ type: props.type }));
        await deleteDB(dbName);
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
                {cacheType === 'cdiscLibrary' && 'Clean CDISC Library Cache'}
                {cacheType === 'controlledTerminology' && 'Clean Controlled Terminology Cache'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    { endpointsCount > 0 && cacheType === 'cdiscLibrary' && (

                        `You have ${endpointsCount} endpoints saved in your cache. Are you sure you want to delete them?`
                    )}
                    { endpointsCount > 0 && cacheType === 'controlledTerminology' && (

                        `You have ${endpointsCount} controlled terminologies saved in your cache. Are you sure you want to delete them?`
                    )}
                    { endpointsCount <= 0 && cacheType === 'cdiscLibrary' && (
                        'There are no saved endpoints.'
                    )}
                    { endpointsCount <= 0 && cacheType === 'controlledTerminology' && (
                        'There are no saved controlled terminologies.'
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

ModalCleanCache.propTypes = {
    type: PropTypes.string.isRequired,
    cacheType: PropTypes.string.isRequired,
};

export default ModalCleanCache;
