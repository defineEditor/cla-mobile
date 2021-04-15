import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Products from './products.js';
import ItemGroups from './itemGroups.js';
import CodeLists from './codeLists.js';
import CodedValues from './codedValues.js';
import Items from './items.js';
import Settings from '../settings/settings.js';
import saveState from './../../utils/saveState.js';
import AppBar from './../utils/appbar.js';
import SnackbarRoot from './../utils/snackbarRoot.js';
import ModalRoot from './../modal/modalRoot.js';

const getStylesMain = makeStyles(theme => ({
    body: {
        paddingTop: theme.spacing(8),
        width: '100%',
        display: 'flex',
        minHeight: '100vh'
    },
    root: {
        width: '100%',
        backgroundColor: 'rgb(146 149 162 / 10%)',
    }
}));

const CdiscLibraryMain = (props) => {
    const page = useSelector(state => state.present.ui.main.page);
    const snackbarOpened = useSelector(state => state.present.ui.snackbar.type) !== null;
    const classes = getStylesMain();

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.ctrlKey && event.keyCode === 123) {
                saveState();
            }
        };

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    return (
        <div className={classes.root}>
            <AppBar page={page}/>
            {snackbarOpened && <SnackbarRoot />}
            <ModalRoot />
            <div className={classes.body}>
                {page === 'settings' && <Settings/>}
                {page === 'products' && <Products/>}
                {page === 'itemGroups' && <ItemGroups/>}
                {page === 'items' && <Items/>}
                {page === 'codeLists' && <CodeLists/>}
                {page === 'codedValues' && <CodedValues/>}
            </div>
        </div>
    );
};

CdiscLibraryMain.propTypes = {
    itemGroupOid: PropTypes.string,
    onClose: PropTypes.func,
    position: PropTypes.number,
};

export default CdiscLibraryMain;
