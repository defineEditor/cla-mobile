import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LibrarySettings from './library.js';
import CTSettings from './ctSettings.js';

const TabPanel = (props) => {
    const { children, value, index, classes } = props;

    return (
        <Grid
            container
            spacing={2}
            hidden={value !== index}
            className={classes.body}
        >
            {value === index && children}
        </Grid>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    body: {
        width: '95%',
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2),
        outline: 'none'
    },
    tabsAppBar: {
        marginTop: theme.spacing(7),
        zIndex: 1000,
    },
    tabs: {
        marginLeft: theme.spacing(6),
    },
    saveCancel: {
        marginLeft: theme.spacing(6),
        top: 'auto',
        bottom: 0,
        zIndex: 1000,
    },
    button: {
        margin: theme.spacing(1),
    },
}));

const SettingTabs = (props) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar
                position='fixed'
                color='default'
                className={classes.tabsAppBar}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant='fullWidth'
                    indicatorColor='primary'
                    textColor='primary'
                    className={classes.tabs}
                    scrollButtons='auto'
                >
                    <Tab label='Library' />
                    <Tab label='CT' />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0} classes={classes}>
                <LibrarySettings {...props} />
            </TabPanel>
            <TabPanel value={value} index={1} classes={classes}>
                <CTSettings {...props} />
            </TabPanel>
            <AppBar
                position='fixed'
                color='default'
                className={classes.saveCancel}
            >
                <Grid container spacing={0} justify='space-around'>
                    <Grid item>
                        <Button color='primary' size='small' onClick={props.save} variant='contained' className={classes.button} disabled={props.settingsNotChanged}>
                            Save
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button color='secondary' size='small' onClick={props.cancel} variant='contained' className={classes.button}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </AppBar>
        </div>
    );
};

export default SettingTabs;
