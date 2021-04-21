import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const getStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
}));

const Loading = (props) => {
    const classes = getStyles();
    return (
        <Grid container spacing={3} direction='column' alignItems='center' justify='center' className={classes.root}>
            <Grid item>
                <Typography variant="h6" color='textSecondary' display='inline'>
                    Loading
                </Typography>
            </Grid>
            <Grid item>
                <CircularProgress/>
            </Grid>
            <Grid item>
                <Button
                    color='default'
                    size='large'
                    variant='contained'
                    onClick={props.onRetry}
                >
                    Retry
                </Button>
            </Grid>
            <Grid item>
                <Typography variant="body2" color='textSecondary'>
                    Use Settings to check connection to CDISC Library
                </Typography>
            </Grid>
        </Grid>
    );
};

Loading.propTypes = {
    onRetry: PropTypes.func.isRequired,
};

export default Loading;
