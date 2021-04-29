import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MenuBook from '@material-ui/icons/MenuBook';
import Language from '@material-ui/icons/Language';
import { changeProductType } from '../../redux/slices/ui.js';
import { FilterContext } from '../../constants/contexts.js';

const useStyles = makeStyles((theme) => ({
    bottomBar: {
        top: 'auto',
        bottom: 0,
    },
    navigation: {
        backgroundColor: '#E0E0E0',
    },
}));

export default function BottomBar () {
    const classes = useStyles();
    const productType = useSelector(state => state.present.ui.products.productType);
    const { filterString, setFilterString } = useContext(FilterContext);
    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        if (filterString !== '') {
            setFilterString('');
        }
        dispatch(changeProductType(newValue));
    };

    return (
        <AppBar position="fixed" className={classes.bottomBar}>
            <BottomNavigation
                value={productType}
                onChange={handleChange}
                showLabels
                className={classes.navigation}
            >
                <BottomNavigationAction label='Standards' value='standards' icon={<MenuBook />} />
                <BottomNavigationAction label='Terminology' value='terminology' icon={<Language />} />
            </BottomNavigation>
        </AppBar>
    );
}
