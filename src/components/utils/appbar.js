import React, { useContext, useRef, useState } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/FindInPage';
import FilterList from '@material-ui/icons/FilterList';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FilterContext } from '../../constants/contexts.js';
import SpeedDial from './speeddial.js';
import { changeBack, updateFilterStringHistory } from '../../redux/slices/ui.js';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 0,
    },
    label: {
        color: '#FFFFFF',
        marginLeft: theme.spacing(1),
    },
    suggestions: {
        minWidth: '138',
        width: 'fit-content',
    },
    clearIcon: {
        color: '#FFFFFF',
    },
    backIcon: {
        marginLeft: theme.spacing(0),
    },
    backArrow: {
        color: theme.palette.common.white,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: 'auto',
    },
    searchIcon: {
        padding: theme.spacing(0, 1),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
        marginTop: '1px',
        transition: theme.transitions.create('width'),
        width: '0px',
        '&:focus': {
            width: '90px',
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(2),
        },
    },
}));

export default function TopBar (props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [searchFocused, setSearchFocused] = useState(false);
    const { filterString, setFilterString } = useContext(FilterContext);
    const label = useSelector(state => state.present.ui[state.present.ui.main.page].label);
    const filterStringHistory = useSelector(state => state.present.ui.main.filterStringHistory[state.present.ui.main.page] || []);
    const inputRef = useRef(null);

    const handleChange = (event, value, reason) => {
        if (reason === 'select-option') {
            setFilterString(value);
        } else if (reason === 'clear') {
            event.stopPropagation();
            setFilterString('');
            setSearchFocused(false);
            inputRef.current.blur();
        } else {
            setFilterString(event.target.value);
        }
    };

    const handleBack = (event) => {
        setFilterString('');
        dispatch(changeBack());
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            dispatch(updateFilterStringHistory({ filterString: event.target.value }));
            inputRef.current.blur();
        }
    };

    return (
        <div className={classes.grow}>
            <AppBar position="fixed">
                <SpeedDial />
                <Toolbar>
                    {!['products'].includes(props.page) && (
                        <IconButton color="default" size='small' onClick={handleBack} className={classes.backIcon}>
                            <ArrowBack className={classes.backArrow}/>
                        </IconButton>
                    )}
                    {!['settings'].includes(props.page) && (
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <Autocomplete
                                freeSolo
                                value={filterString}
                                options={filterStringHistory}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => { setSearchFocused(true); }}
                                onBlur={() => { setSearchFocused(false); }}
                                classes={{
                                    paper: classes.suggestions,
                                    clearIndicator: classes.clearIcon
                                }}
                                renderInput={params => (
                                    <InputBase
                                        ref={params.InputProps.ref}
                                        endAdornment={searchFocused && params.InputProps.endAdornment}
                                        placeholder="Filter"
                                        inputRef={inputRef}
                                        inputProps={params.inputProps}
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                    />
                                )}
                            />
                        </div>
                    )}
                    {['items', 'codeLists', 'codedValues'].includes(props.page) && (
                        <IconButton color="default" size='small' className={classes.backIcon}>
                            <FilterList className={classes.backArrow}/>
                        </IconButton>
                    )}
                    { !searchFocused && (
                        <Typography variant='h6' color='textPrimary' className={classes.label}>
                            {label}
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}
