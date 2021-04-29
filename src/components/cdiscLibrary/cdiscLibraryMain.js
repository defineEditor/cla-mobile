import React, { useEffect, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import saveState from './../../utils/saveState.js';
const Products = lazy(() => import('./products.js'));
const AppBar = lazy(() => import('../utils/appbar.js'));
const ItemGroups = lazy(() => import('./itemGroups.js'));
const CodeLists = lazy(() => import('./codeLists.js'));
const CodedValues = lazy(() => import('./codedValues.js'));
const Items = lazy(() => import('./items.js'));
const About = lazy(() => import('./about.js'));
const Settings = lazy(() => import('../settings/settings.js'));
const SnackbarRoot = lazy(() => import('../utils/snackbarRoot.js'));
const ModalRoot = lazy(() => import('../modal/modalRoot.js'));

const getStylesMain = makeStyles(theme => ({
    body: {
        paddingTop: theme.spacing(8),
        display: 'flex',
        minHeight: '100vh'
    },
    root: {
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
            <Suspense fallback={<div>Loading...</div>}>
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
                    {page === 'about' && <About/>}
                </div>
            </Suspense>
        </div>
    );
};

CdiscLibraryMain.propTypes = {
    itemGroupOid: PropTypes.string,
    onClose: PropTypes.func,
    position: PropTypes.number,
};

export default CdiscLibraryMain;
