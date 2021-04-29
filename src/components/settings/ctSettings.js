import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    adorementIcon: {
        outline: 'none'
    },
    switch: {
    },
    location: {
        width: '90%',
        margin: theme.spacing(1)
    },
    textFieldShort: {
        width: 300,
        margin: theme.spacing(1)
    },
    textFieldNumber: {
        width: 200,
        margin: theme.spacing(1)
    },
    actionButtonGrid: {
        display: 'flex',
        justifyContent: 'center',
    },
    actionButton: {
        flex: '1 1 33',
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(3)
    },
    subTitle: {
        marginTop: theme.spacing(2)
    },
}));

const CtSettings = (props) => {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={12} className={classes.subTitle}>
                <Typography variant="h6" gutterBottom align="left" color='textSecondary'>
                    Configuration
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={props.settings.cdiscLibrary.useNciSiteForCt}
                                onChange={props.handleChange('cdiscLibrary', 'useNciSiteForCt')}
                                color='primary'
                                className={classes.switch}
                            />
                        }
                        label='Use NCI site to download Controlled Terminology'
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12} className={classes.actionButtonGrid}>
                <Button
                    variant='contained'
                    color='default'
                    onClick={props.cleanCtCache}
                    className={classes.actionButton}
                >
                    Clean CT Cache
                </Button>
            </Grid>
            <Grid item xs={12} className={classes.subTitle}>
                <Typography variant="h6" gutterBottom align="left" color='textSecondary'>
                    Terminologies
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={props.settings.controlledTerminology.showLessMore}
                                onChange={props.handleChange('controlledTerminology', 'showLessMore')}
                                color='primary'
                                className={classes.switch}
                            />
                        }
                        label='Show more/less buttons'
                    />
                </FormGroup>
            </Grid>
        </Grid>
    );
};

export default CtSettings;
