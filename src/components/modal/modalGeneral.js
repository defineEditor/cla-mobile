import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactMarkdown from 'react-markdown';
import Button from '@material-ui/core/Button';
import { closeModal } from '../../redux/slices/ui.js';

const getStyles = makeStyles(theme => ({
    dialog: {
        paddingBottom: theme.spacing(1),
        position: 'absolute',
        borderRadius: '10px',
        top: '20%',
        transform: 'translate(0%, calc(-50%+0.5px))',
        overflowX: 'auto',
        maxHeight: '70%',
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

const ModalGeneral = (props) => {
    const dispatch = useDispatch();
    const classes = getStyles();

    const onClose = () => {
        dispatch(closeModal({ type: props.type }));
    };

    const onKeyDown = (event) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            onClose();
        }
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open
            PaperProps={{ className: classes.dialog }}
            onKeyDown={onKeyDown}
            tabIndex='0'
        >
            <DialogTitle className={classes.title} disableTypography>
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.markdown === true ? <ReactMarkdown source={props.message} /> : props.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ModalGeneral.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default ModalGeneral;
