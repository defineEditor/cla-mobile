import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

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
    actionButton: {
        marginRight: theme.spacing(3)
    },
    subTitle: {
        marginTop: theme.spacing(2)
    },
}));

const Library = (props) => {
    const classes = useStyles();
    const [showKey, setShowKey] = useState(false);

    return (
        <Grid container>
            <Grid item xs={12} className={classes.subTitle}>
                <Typography variant="h6" gutterBottom align="left" color='textSecondary'>
                    Configuration
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label='API Key'
                    value={props.settings.cdiscLibrary.apiKey}
                    onChange={props.handleChange('cdiscLibrary', 'apiKey', 'string')}
                    type={showKey ? 'text' : 'password'}
                    helperText='CDISC Library Primary API Key'
                    className={classes.textFieldShort}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton
                                    aria-label="Toggle apiKey visibility"
                                    onClick={() => setShowKey(!showKey)}
                                    className={classes.adorementIcon}
                                >
                                    {showKey ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label='Base URL'
                    value={props.settings.cdiscLibrary.baseUrl}
                    onChange={props.handleChange('cdiscLibrary', 'baseUrl', 'string')}
                    helperText='CDISC Library API base URL'
                    className={classes.textFieldShort}
                />
            </Grid>
            <Grid item xs={12} container justify='center'>
                <Grid item>
                    <Button
                        variant='contained'
                        color='default'
                        onClick={props.checkCdiscLibraryConnection}
                        className={classes.actionButton}
                    >
                        Check
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant='contained'
                        color='default'
                        onClick={props.cleanCdiscLibraryCache}
                        className={classes.actionButton}
                    >
                        Clean Cache
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.subTitle}>
                <Typography variant="h6" gutterBottom align="left" color='textSecondary'>
                    Updates
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={props.settings.cdiscLibrary.checkForCLUpdates}
                                onChange={props.handleChange('cdiscLibrary', 'checkForCLUpdates')}
                                color='primary'
                                className={classes.switch}
                            />
                        }
                        label='Check for CDISC Library updates'
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12} className={classes.subTitle}>
                <Typography variant="h6" gutterBottom align="left" color='textSecondary'>
                    Item Groups
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={props.settings.cdiscLibrary.itemGroupsGridView}
                                onChange={props.handleChange('cdiscLibrary', 'itemGroupsGridView')}
                                color='primary'
                                className={classes.switch}
                            />
                        }
                        label='Grid view'
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12} className={classes.subTitle}>
                <Typography variant="h6" gutterBottom align="left" color='textSecondary'>
                    Items
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={props.settings.cdiscLibrary.itemsShowSetSubheader}
                                onChange={props.handleChange('cdiscLibrary', 'itemsShowSetSubheader')}
                                color='primary'
                                className={classes.switch}
                            />
                        }
                        label='Show subheaders for variable sets or classes'
                    />
                </FormGroup>
            </Grid>
        </Grid>
    );
};

export default Library;
