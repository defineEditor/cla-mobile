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
}));

const Library = (props) => {
    const classes = useStyles();
    const [showKey, setShowKey] = useState(false);

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom align="left" color='textSecondary'>
                    CDISC Library
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
                                disabled={props.settings.cdiscLibrary.enableCdiscLibrary === false}
                                className={classes.switch}
                            />
                        }
                        label='Check for CDISC Library updates'
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={props.settings.cdiscLibrary.oAuth2}
                                onChange={props.handleChange('cdiscLibrary', 'oAuth2')}
                                color='primary'
                                disabled={props.settings.cdiscLibrary.enableCdiscLibrary === false}
                                className={classes.switch}
                            />
                        }
                        label='Use OAuth2 authentication'
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label='API Key'
                    disabled={!props.settings.cdiscLibrary.enableCdiscLibrary}
                    value={props.settings.cdiscLibrary.apiKey}
                    onChange={props.handleChange('cdiscLibrary', 'apiKey')}
                    type={props.state.showEncryptedValue ? 'text' : 'password'}
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
                    disabled={!props.settings.cdiscLibrary.enableCdiscLibrary}
                    value={props.settings.cdiscLibrary.baseUrl}
                    onChange={props.handleChange('cdiscLibrary', 'baseUrl')}
                    helperText='CDISC Library API base URL'
                    className={classes.textFieldShort}
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant='contained'
                    color='default'
                    disabled={!props.settings.cdiscLibrary.enableCdiscLibrary}
                    onClick={props.checkCdiscLibraryConnection}
                    className={classes.actionButton}
                >
                    Check Connection
                </Button>
                <Button
                    variant='contained'
                    color='default'
                    disabled={!props.settings.cdiscLibrary.enableCdiscLibrary}
                    onClick={props.cleanCdiscLibraryCache}
                    className={classes.actionButton}
                >
                    Clean Cache
                </Button>
            </Grid>
        </Grid>
    );
};

export default Library;
