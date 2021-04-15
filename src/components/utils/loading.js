import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const getStyles = makeStyles(theme => ({
    root: {
        margin: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
}));

const Loading = (props) => {
    const classes = getStyles();
    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction='column' alignItems='center'>
                <Grid item>
                    <Typography variant="h6" color='textSecondary' display='inline'>
                        Loading
                    </Typography>
                </Grid>
                <Grid item>
                    <CircularProgress className={classes.progress} />
                </Grid>
                <Grid item>
                    <Button
                        color='default'
                        size='large'
                        variant='contained'
                        className={classes.button}
                        onClick={props.onRetry}
                    >
                        Retry
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

Loading.propTypes = {
    onRetry: PropTypes.func.isRequired,
};

export default Loading;
