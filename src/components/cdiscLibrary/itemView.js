import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import { getDecode, getDescription } from '../../utils/cdiscLibraryUtils.js';

const getStyles = makeStyles(theme => ({
    root: {
        height: '90vh',
        padding: theme.spacing(2),
        backgroundColor: 'rgb(146 149 162 / 10%)',
    },
    nameItem: {
        flex: 1,
    },
    name: {
        flex: 1,
        transform: 'translate(0px, 5px);',
    },
    nameField: {
        flex: 1,
        transform: 'translate(0px, 5px);',
        wordBreak: 'keep-all',
        whiteSpace: 'nowrap',
    },
    label: {
        fontSize: 18,
    },
    codelistButton: {
    },
    variableSetButton: {
        color: theme.palette.primary.main,
        padding: 0,
        fontSize: '20px',
        boxSizing: 'border-box',
        transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        fontWeight: 600,
        lineHeight: 1.75,
        borderRadius: '4px',
        letterSpacing: '0.02857em',
    },
    subheader: {
        fontSize: 12,
    },
}));

const ItemView = (props) => {
    if (props.item === null) {
        return null;
    }

    const classes = getStyles();
    const item = props.item;

    const FieldView = () => {
        return (
            <React.Fragment>
                <Grid item>
                    <Typography className={classes.label} color="textSecondary">
                        {item.prompt}
                    </Typography>
                </Grid>
                <Grid item container justify='flex-start' alignItems='flex-end' wrap='nowrap'>
                    <Grid item className={classes.nameItem}>
                        <Typography variant="h4" className={classes.nameField}>
                            {item.name}
                        </Typography>
                    </Grid>
                    <Grid item container justify='space-evenly'>
                        <Grid item>
                            <Typography className={classes.subheader} color="textSecondary">
                                Type
                            </Typography>
                            <Typography variant="body1">
                                {item.simpleDatatype}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <ButtonBase className={classes.variableSetButton}>{item.variableSetDescription}</ButtonBase>
                </Grid>
                {item.codelist !== undefined && (
                    <Grid item>
                        <Typography className={classes.subheader} color="textSecondary">
                            Codelist
                        </Typography>
                        <Button
                            className={classes.codelistButton}
                            variant='contained'
                        >
                            {item.codelist}
                        </Button>
                    </Grid>
                )}
                <Grid item>
                    <Typography className={classes.subheader} color="textSecondary">
                        Definition
                    </Typography>
                    <Typography variant="body1">
                        {item.definition}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography className={classes.subheader} color="textSecondary">
                        Question Text
                    </Typography>
                    <Typography variant="body1">
                        {item.questionText}
                    </Typography>
                </Grid>
                {item.completionInstructions !== undefined && (
                    <Grid item>
                        <Typography className={classes.subheader} color="textSecondary">
                            Completion Instructions
                        </Typography>
                        <Typography variant="body1">
                            {item.completionInstructions}
                        </Typography>
                    </Grid>
                )}
                {item.mappingInstructions !== undefined && (
                    <Grid item>
                        <Typography className={classes.subheader} color="textSecondary">
                            Mapping Instructions
                        </Typography>
                        <Typography variant="body1">
                            {item.mappingInstructions}
                        </Typography>
                    </Grid>
                )}
                <Grid item>
                    <Typography className={classes.subheader} color="textSecondary">
                        Implementation Notes
                    </Typography>
                    <Typography variant="body1">
                        {item.implementationNotes}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.subheader} color="textSecondary">
                        Prompt
                    </Typography>
                    <Typography variant="body1">
                        {item.prompt}
                    </Typography>
                </Grid>
            </React.Fragment>
        );
    };

    const VariableView = () => {
        return (
            <React.Fragment>
                <Grid item>
                    <Typography className={classes.label} color="textSecondary">
                        {item.label}
                    </Typography>
                </Grid>
                <Grid item container justify='flex-start' alignItems='flex-end' wrap='nowrap'>
                    <Grid item className={classes.nameItem}>
                        <Typography variant="h4" className={classes.name}>
                            {item.name}
                        </Typography>
                    </Grid>
                    <Grid item container justify='space-evenly'>
                        <Grid item>
                            <Typography className={classes.subheader} color="textSecondary">
                                Type
                            </Typography>
                            <Typography variant="body1">
                                {item.simpleDatatype}
                            </Typography>
                        </Grid>
                        { item.core && (
                            <Grid item>
                                <Typography className={classes.subheader} color="textSecondary">
                                    Core
                                </Typography>
                                <Typography variant="body1">
                                    {item.core}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid item>
                    <ButtonBase className={classes.variableSetButton}>{item.variableSetDescription}</ButtonBase>
                </Grid>
                { item.role && (
                    <Grid item container justify='flex-start' alignItems='flex-end' wrap='nowrap' spacing={4}>
                        <Grid item>
                            <Typography className={classes.subheader} color="textSecondary">
                                Role
                            </Typography>
                            <Typography variant="body1">
                                {item.role}
                            </Typography>
                        </Grid>
                        { item.roleDescription && (
                            <Grid item>
                                <Typography className={classes.subheader} color="textSecondary">
                                    Role Description
                                </Typography>
                                <Typography variant="body1">
                                    {item.roleDescription}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
                {item.describedValueDomain !== undefined && (
                    <Grid item>
                        <Typography className={classes.subheader} color="textSecondary">
                            Value Domain
                        </Typography>
                        <Typography variant="body1">
                            {item.describedValueDomain}
                        </Typography>
                    </Grid>
                )}
                {item.valueList !== undefined && (
                    <Grid item>
                        <Typography className={classes.subheader} color="textSecondary">
                            Possible Values
                        </Typography>
                        <Typography variant="body1">
                            {item.valueList.join(', ')}
                        </Typography>
                    </Grid>
                )}
                {item.codelist !== undefined && (
                    <Grid item>
                        <Typography className={classes.subheader} color="textSecondary">
                            Codelist
                        </Typography>
                        <Button
                            className={classes.codelistButton}
                            variant='contained'
                        >
                            {item.codelist}
                        </Button>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Typography className={classes.subheader} color="textSecondary">
                        Description
                    </Typography>
                    <Typography variant="body1">
                        {item.description}
                    </Typography>
                </Grid>
            </React.Fragment>
        );
    };

    const CodedValueView = () => {
        return (
            <React.Fragment>
                <Grid item container justify='flex-start' alignItems='flex-end' wrap='nowrap'>
                    <Grid item className={classes.nameItem}>
                        <Typography variant="h4" className={classes.name}>
                            {item.codedValue}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.subheader} color="textSecondary">
                            C-Code
                        </Typography>
                        <Typography variant="body1">
                            {item.alias ? item.alias.name : ''}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography className={classes.subheader} color="textSecondary">
                        Preferred Term
                    </Typography>
                    <Typography variant="body1">
                        {getDecode(item)}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography className={classes.subheader} color="textSecondary">
                        Definition
                    </Typography>
                    <Typography variant="body1">
                        {item.definition}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography className={classes.subheader} color="textSecondary">
                        Synonyms
                    </Typography>
                    <Typography variant="body1">
                        {item.synonyms.join(', ')}
                    </Typography>
                </Grid>
            </React.Fragment>
        );
    };

    const CodeListView = () => {
        return (
            <React.Fragment>
                <Grid item container justify='flex-start' alignItems='flex-end' wrap='nowrap'>
                    <Grid item className={classes.nameItem}>
                        <Typography variant="h4" className={classes.name}>
                            {item.cdiscSubmissionValue}
                        </Typography>
                    </Grid>
                    <Grid item container justify='space-evenly'>
                        <Grid item>
                            <Typography className={classes.subheader} color="textSecondary">
                                Extensible
                            </Typography>
                            <Typography variant="body1">
                                {item.codeListExtensible}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.subheader} color="textSecondary">
                                C-Code
                            </Typography>
                            <Typography variant="body1">
                                {item.alias ? item.alias.name : ''}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography className={classes.subheader} color="textSecondary">
                        Name
                    </Typography>
                    <Typography variant="body1">
                        {item.name}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography className={classes.subheader} color="textSecondary">
                        Description
                    </Typography>
                    <Typography variant="body1">
                        {getDescription(item)}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography className={classes.subheader} color="textSecondary">
                        Preferred Term
                    </Typography>
                    <Typography variant="body1">
                        {item.preferredTerm}
                    </Typography>
                </Grid>
                {item.synonyms !== undefined && (
                    <Grid item>
                        <Typography className={classes.subheader} color="textSecondary">
                            Synonyms
                        </Typography>
                        <Typography variant="body1">
                            {item.synonyms.join(', ')}
                        </Typography>
                    </Grid>
                )}
            </React.Fragment>
        );
    };

    return (
        <Grid
            container
            direction='column'
            justify='flex-start'
            alignItems='flex-start'
            className={classes.root}
            spacing={1}
            wrap='nowrap'
        >
            {props.type === 'codedValue' && CodedValueView()}
            {props.type === 'codeList' && CodeListView()}
            {props.type === 'field' && FieldView()}
            {props.type === 'variableView' && VariableView()}
        </Grid>
    );
};

export default ItemView;
