import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Copy from '@material-ui/icons/FileCopyOutlined';
import { getDecode, getDescription } from '../../utils/cdiscLibraryUtils.js';
import { openSnackbar } from '../../redux/slices/ui.js';

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
        whiteSpace: 'nowrap',
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
        fontSize: 16,
        marginTop: theme.spacing(1),
    },
    codeListItem: {
        whiteSpace: 'nowrap',
    },
    copyButton: {
        padding: 5,
        transform: 'translate(0, -3px)',
    },
    copyIcon: {
        height: 20,
    },
}));

const ElementView = (props) => {
    const { classes, label, value, copyToClipboard, gridClassName, typographyClassName, variant } = props;
    return (
        <Grid item className={gridClassName}>
            <Typography className={typographyClassName ?? classes.subheader} color="textSecondary">
                {label}
                { copyToClipboard !== undefined && (
                    <IconButton
                        color="default"
                        onClick={copyToClipboard(value)}
                        className={classes.copyButton}
                    >
                        <Copy className={classes.copyIcon} />
                    </IconButton>
                )}
            </Typography>
            <Typography variant={variant ?? 'body1'}>
                {value}
            </Typography>
        </Grid>
    );
};

const ItemView = (props) => {
    const dispatch = useDispatch();
    if (props.item === null) {
        return null;
    }

    const classes = getStyles();
    const item = props.item;

    const copyToClipboard = (text) => (event) => {
        navigator.clipboard.writeText(text);
        dispatch(openSnackbar({
            type: 'success',
            message: 'Copied to clipboard',
            props: {
                duration: 1000,
            }
        }));
    };

    const FieldView = () => {
        return (
            <React.Fragment>
                <Grid item>
                    <ButtonBase className={classes.variableSetButton}>{item.variableSetDescription}</ButtonBase>
                </Grid>
                <Grid item container justify='flex-start' alignItems='flex-start' wrap='nowrap'>
                    <ElementView
                        label='Name'
                        value={item.name}
                        gridClassName={classes.nameField}
                        typographyClassName={classes.name}
                        variant='h4'
                        classes={classes}
                        copyToClipboard={copyToClipboard}
                    />
                    <Grid item container justify='space-evenly'>
                        <ElementView label='Type' value={item.simpleDatatype} classes={classes} copyToClipboard={copyToClipboard}/>
                    </Grid>
                </Grid>
                <ElementView label='Prompt' value={item.prompt} classes={classes} copyToClipboard={copyToClipboard}/>
                {item.codelist !== undefined && (
                    <ElementView label='Codelist' value={item.codelist} classes={classes} copyToClipboard={copyToClipboard}/>
                )}
                <ElementView label='Definition' value={item.definition} classes={classes} copyToClipboard={copyToClipboard}/>
                <ElementView label='Question Text' value={item.questionText} classes={classes} copyToClipboard={copyToClipboard}/>
                {item.completionInstructions !== undefined && (
                    <ElementView label='Completion Instructions' value={item.completionInstructions} classes={classes} copyToClipboard={copyToClipboard}/>
                )}
                {item.mappingInstructions !== undefined && (
                    <ElementView label='Mapping Instructions' value={item.mappingInstructions} classes={classes} copyToClipboard={copyToClipboard}/>
                )}
                <ElementView label='Implementation Notes' value={item.implementationNotes} classes={classes} copyToClipboard={copyToClipboard}/>
            </React.Fragment>
        );
    };

    const VariableView = () => {
        return (
            <React.Fragment>
                <Grid item>
                    <ButtonBase className={classes.variableSetButton}>{item.variableSetDescription}</ButtonBase>
                </Grid>
                <Grid item container justify='flex-start' alignItems='flex-start' wrap='nowrap'>
                    <ElementView
                        label='Name'
                        value={item.name}
                        gridClassName={classes.nameItem}
                        typographyClassName={classes.name}
                        variant='h4'
                        classes={classes}
                        copyToClipboard={copyToClipboard}
                    />
                    <Grid item container justify='space-evenly'>
                        <ElementView label='Type' value={item.simpleDatatype} classes={classes} copyToClipboard={copyToClipboard}/>
                        {item.core && (
                            <ElementView label='Core' value={item.core} classes={classes} copyToClipboard={copyToClipboard}/>
                        )}

                    </Grid>
                </Grid>
                <ElementView label='Label' value={item.label} classes={classes} copyToClipboard={copyToClipboard}/>
                { item.role && (
                    <Grid item container justify='flex-start' alignItems='flex-end' wrap='nowrap' spacing={4}>
                        <ElementView label='Role' value={item.role} classes={classes} copyToClipboard={copyToClipboard}/>
                        { item.roleDescription && (
                            <ElementView label='Role Description' value={item.roleDescription} classes={classes} copyToClipboard={copyToClipboard}/>
                        )}
                    </Grid>
                )}
                {item.describedValueDomain !== undefined && (
                    <ElementView label='Value Domain' value={item.describedValueDomain} classes={classes} copyToClipboard={copyToClipboard}/>
                )}
                {item.valueList !== undefined && (
                    <ElementView label='Possible Values' value={item.valueList.join(', ')} classes={classes} copyToClipboard={copyToClipboard}/>
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
                <ElementView label='Description' value={item.description} classes={classes} copyToClipboard={copyToClipboard}/>
            </React.Fragment>
        );
    };

    const CodedValueView = () => {
        return (
            <React.Fragment>
                <Grid item container justify='flex-start' alignItems='flex-start' wrap='nowrap'>
                    <ElementView
                        label='Coded Value'
                        value={item.codedValue}
                        gridClassName={classes.nameItem}
                        typographyClassName={classes.name}
                        variant='h6'
                        classes={classes}
                        copyToClipboard={copyToClipboard}
                    />
                    <ElementView label='C-Code' value={item.alias ? item.alias.name : ''} classes={classes}/>
                </Grid>
                <ElementView label='Preferred Term' value={getDecode(item)} classes={classes} copyToClipboard={copyToClipboard}/>
                <ElementView label='Definition' value={item.definition} classes={classes} copyToClipboard={copyToClipboard}/>
                {item.synonyms.length > 0 && (
                    <ElementView label='Synonyms' value={item.synonyms.join(', ')} classes={classes} copyToClipboard={copyToClipboard}/>
                )}
            </React.Fragment>
        );
    };

    const ItemGroupView = () => {
        return (
            <React.Fragment>
                <Grid item>
                    <Typography className={classes.label} color="textSecondary">
                        {item.label}
                    </Typography>
                </Grid>
                <Grid item container justify='flex-start' alignItems='flex-start' wrap='nowrap'>
                    <ElementView
                        label='Name'
                        value={item.name}
                        gridClassName={classes.nameItem}
                        typographyClassName={classes.name}
                        variant='h4'
                        classes={classes}
                        copyToClipboard={copyToClipboard}
                    />
                    <Grid item container justify='space-evenly'>
                        <ElementView label='Number of Items' value={item.itemNum} classes={classes}/>
                    </Grid>
                </Grid>
                {item.description !== undefined && (
                    <ElementView label='Description' value={item.description} classes={classes} copyToClipboard={copyToClipboard}/>
                )}
            </React.Fragment>
        );
    };

    const CodeListView = () => {
        return (
            <React.Fragment>
                <Grid item container justify='flex-start' alignItems='flex-start' wrap='nowrap'>
                    <ElementView
                        label='Submission Value'
                        value={item.cdiscSubmissionValue}
                        gridClassName={classes.codeListItem}
                        typographyClassName={classes.name}
                        variant='h4'
                        classes={classes}
                        copyToClipboard={copyToClipboard}
                    />
                    <Grid item container justify='space-evenly'>
                        <ElementView label='Extensible' value={item.codeListExtensible} classes={classes} />
                        <ElementView label='C-Code' value={item.alias ? item.alias.name : ''} classes={classes} />
                    </Grid>
                </Grid>
                <ElementView label='Name' value={item.name} classes={classes} copyToClipboard={copyToClipboard}/>
                <ElementView label='Description' value={getDescription(item)} classes={classes} copyToClipboard={copyToClipboard}/>
                <ElementView label='Preferred Term' value={item.preferredTerm} classes={classes} copyToClipboard={copyToClipboard}/>
                {item.synonyms.length > 0 && (
                    <ElementView label='Synonyms' value={item.synonyms.join(', ')} classes={classes} copyToClipboard={copyToClipboard}/>
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
            wrap='nowrap'
        >
            {props.type === 'codedValue' && CodedValueView()}
            {props.type === 'codeList' && CodeListView()}
            {props.type === 'field' && FieldView()}
            {props.type === 'variable' && VariableView()}
            {props.type === 'itemGroup' && ItemGroupView()}
        </Grid>
    );
};

export default ItemView;
