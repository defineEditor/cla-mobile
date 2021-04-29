import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useAboutStyles = makeStyles(theme => ({
    root: {
        maxWidth: '95%',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

const About = () => {
    const classes = useAboutStyles();
    const version = useSelector(state => state.present.ui.main.version);
    // Get release notes link
    const releaseNotesLink = 'http://defineeditor.com/cla-mobile/releases';

    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant='h5' align='center' color='textSecondary' gutterBottom>
                        CDISC Library Mobile Browser
                    </Typography>
                    <Typography variant='h6' align='center' color='textSecondary' paragraph>
                        Version {version}
                    </Typography>
                    <Typography variant='body1' color='textPrimary' gutterBottom>
                        See&nbsp;
                        <Link href={releaseNotesLink} target="_blank" rel="noopener noreferrer">
                            release notes
                        </Link> for the list of changes.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='subtitle1' color='textSecondary'>Contacts</Typography>
                    <Typography variant='body1' paragraph>
                        <Link href='https://t.me/defineeditor' target="_blank" rel="noopener noreferrer">Telegram</Link>
                        <br/>
                        <Link href='http://defineeditor.com' target="_blank" rel="noopener noreferrer">Website</Link>
                        <br/>
                        <Link href='mailto:info@defineeditor.com' target="_blank" rel="noopener noreferrer">E-mail</Link>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='subtitle1' color='textSecondary'>Developed By</Typography>
                    <Typography variant='body1' paragraph>
                        <Link href='https://www.linkedin.com/in/dmitry-kolosov-91751413/' target="_blank" rel="noopener noreferrer">
                            Dmitry Kolosov
                        </Link>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='subtitle1' color='textSecondary'>Source Code</Typography>
                    <Typography variant='body1' paragraph>
                        <Link href='https://github.com/cla-mobile' target="_blank" rel="noopener noreferrer">
                            GitHub
                        </Link>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

export default About;
