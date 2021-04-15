import React, { useContext, useRef } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/FindInPage';
import FilterList from '@material-ui/icons/FilterList';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { FilterContext } from '../../constants/contexts.js';
import SpeedDial from './speeddial.js';
import { changeBack } from '../../redux/slices/ui.js';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 0,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
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
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
        transition: theme.transitions.create('width'),
        width: '0px',
        '&:focus': {
            width: '90px',
        },
    },
}));

export default function TopBar (props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { filterString, setFilterString } = useContext(FilterContext);
    const inputRef = useRef(null);

    const handleChange = (event) => {
        setFilterString(event.target.value);
    };

    const handleBack = (event) => {
        setFilterString('');
        dispatch(changeBack());
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
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
                            <InputBase
                                placeholder="Filter"
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                inputRef={inputRef}
                                value={filterString}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                    )}
                    {['items', 'codeLists', 'codedValues'].includes(props.page) && (
                        <IconButton color="default" size='small' className={classes.backIcon}>
                            <FilterList className={classes.backArrow}/>
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}
