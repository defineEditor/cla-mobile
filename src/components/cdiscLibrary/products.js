import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Cached from '@material-ui/icons/Cached';
import saveState from '../utils/saveState.js';
import BottomBar from '../utils/bottombar.js';
import Loading from '../utils/loading.js';
import { CdiscLibraryContext, FilterContext, MenuActionsContext } from '../../constants/contexts.js';
import { getProductTitle } from '../../utils/cdiscLibraryUtils.js';
import { changePage, openSnackbar } from '../../redux/slices/ui.js';
import { openDB } from 'idb';

const getStyles = makeStyles(theme => ({
    classHeading: {
        marginBottom: 0,
    },
    heading: {
        marginBottom: theme.spacing(0.5),
    },
    classItem: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    main: {
        paddingLeft: 0,
        paddingRight: 0,
        marginBottom: theme.spacing(6),
        outline: 'none',
    },
    addItem: {
        outline: 'none'
    },
    classPanel: {
        width: '98%',
    },
    group: {
        width: '100%',
        textAlign: 'center',
    },
    classGrid: {
        width: '100%',
        textAlign: 'center',
    },
    groupPanel: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    buttonGrid: {
        flex: '0 1 50%',
    },
    button: {
        width: '100%',
        height: '100%',
        fontWeight: '500',
        minHeight: '45px',
    },
    smallTextButton: {
        width: '100%',
        height: '100%',
        fontWeight: '500',
        fontSize: '12px',
        minHeight: '45px',
    },
}));

const Products = () => {
    const [productClasses, setProductClasses] = useState({});
    const [showAll, setShowAll] = useState({});
    const dispatch = useDispatch();
    const cdiscLibrary = useContext(CdiscLibraryContext).cdiscLibrary;
    const { filterString, setFilterString } = useContext(FilterContext);
    const { setMenuActions } = useContext(MenuActionsContext);
    const { productType, recentStandards, recentCt } = useSelector(state => state.present.ui.products);
    const { showLessMore } = useSelector(state => state.present.settings.controlledTerminology);
    const classes = getStyles();

    const getProductClasses = useCallback(async () => {
        try {
            let pc = await cdiscLibrary.getProductClasses();
            if (cdiscLibrary.coreObject.useNciSiteForCt) {
                // When NCI site is enabled, load the full list of CTs
                await cdiscLibrary.getCtFromNciSite();
                pc = await cdiscLibrary.getProductClasses();
            }
            setProductClasses(pc);
        } catch (error) {
            dispatch(openSnackbar({
                type: 'error',
                message: 'Error while loading products',
            }));
        }
    }, [cdiscLibrary, dispatch]);

    useEffect(() => {
        getProductClasses();
    }, [getProductClasses]);

    // Reload action for main menu
    useEffect(() => {
        const deepReloadProducts = async () => {
            setProductClasses({});
            const db = await openDB('cdiscLibrary-store', 1, {
                upgrade (db) {
                    // Create a store of objects
                    db.createObjectStore('cdiscLibrary', {});
                },
            });

            await db.delete('cdiscLibrary', 'products');
            // Delete all nciSite keys
            const allKeys = await db.getAllKeys('cdiscLibrary');
            for (let i = 0; i < allKeys.length; i++) {
                const key = allKeys[i];
                if (key.startsWith('nciSite/')) {
                    await db.delete('cdiscLibrary', key);
                }
            }

            // Reset the library contents
            cdiscLibrary.reset();
            getProductClasses();
        };

        setMenuActions([{
            position: 2,
            action: { icon: <Cached />, name: 'Reload', onClick: deepReloadProducts }
        }]);
        return () => { setMenuActions([]); };
    }, [cdiscLibrary, getProductClasses, setMenuActions]);

    const selectProduct = (productId, productName) => () => {
        setFilterString('');
        if (productType === 'standards') {
            dispatch(changePage({ page: 'itemGroups', productId, label: productName }));
        } else if (productType === 'terminology') {
            dispatch(changePage({ page: 'codeLists', productId, label: productName }));
        }
        // Save state, so that recent update is not lost
        saveState();
    };

    const getGroups = (data, classes) => {
        const result = Object.keys(data)
            .sort()
            .filter(groupId => {
                return Object.keys(data[groupId].products).some(productId => {
                    const title = data[groupId].products[productId].title;
                    if (filterString !== '') {
                        return title.toLowerCase().includes(filterString.toLowerCase());
                    } else {
                        return true;
                    }
                });
            })
            .map(groupId => {
                return (
                    <React.Fragment key={groupId}>
                        <List
                            key={groupId}
                            className={classes.groupPanel}
                        >
                            <ListItem
                                key={groupId}
                                dense
                            >
                                <Grid container justify='flex-start'>
                                    <Grid item ls={12} className={classes.group}>
                                        <Typography variant='h6' color='textPrimary' className={classes.heading}>{data[groupId].title}</Typography>
                                    </Grid>
                                    <Grid item className={classes.group}>
                                        <Grid container spacing={2} justify='flex-start'>
                                            {getProducts(data[groupId].products, groupId, classes)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                    </React.Fragment>
                );
            });
        return (result);
    };

    const getProducts = (data, groupId, classes) => {
        // Sort codelists
        let dataArray = (productType === 'standards' || groupId === 'recent') ? Object.keys(data) : Object.keys(data).reverse();
        const buttonClass = groupId === 'recent' && productType === 'terminology' ? classes.smallTextButton : classes.button;
        // ADaM 2.1 is intentionally hidden as it is blank
        dataArray = dataArray.filter(id => id !== 'adam-2-1');
        // Apply filter
        dataArray = dataArray.filter(id => {
            if (filterString !== '') {
                return data[id].title.toLowerCase().includes(filterString.toLowerCase());
            } else {
                return true;
            }
        });

        // Limit the number of CTs shown
        let addMoreButton = false;
        if (showLessMore && productType === 'terminology' && showAll[groupId] !== true && dataArray.length > 6) {
            dataArray = dataArray.slice(0, 5);
            addMoreButton = true;
        }

        const result = dataArray
            .filter(id => id !== 'adam-2-1')
            .map(id => {
                return (
                    <Grid key={id} item className={classes.buttonGrid}>
                        <Fab
                            variant='extended'
                            color='default'
                            onClick={ selectProduct(id, data[id].title) }
                            className={buttonClass}
                        >
                            {data[id].title}
                        </Fab>
                    </Grid>
                );
            });

        // Add More button
        if (addMoreButton) {
            result.push(
                <Grid key='more' item className={classes.buttonGrid}>
                    <Fab
                        variant='extended'
                        color='default'
                        onClick={() => setShowAll({ ...showAll, [groupId]: true })}
                        className={buttonClass}
                    >
                        More
                    </Fab>
                </Grid>
            );
        }
        // Add Less button
        if (showLessMore && showAll[groupId] === true) {
            result.push(
                <Grid key='less' item className={classes.buttonGrid}>
                    <Fab
                        variant='extended'
                        color='default'
                        onClick={() => setShowAll({ ...showAll, [groupId]: false })}
                        className={buttonClass}
                    >
                        Less
                    </Fab>
                </Grid>
            );
        }
        return (result);
    };

    const getClasses = (data, classes) => {
        const allProducts = {};
        const panelIds = Object.keys(data);
        if (panelIds.length === 0) {
            // Products were not loaded
            return;
        }
        let parsedData = {};
        if (productType === 'standards') {
            panelIds
                .filter(classId => (classId !== 'terminology'))
                .forEach(classId => {
                    // Create label from the ID
                    parsedData[classId] = { title: classId.replace('-', ' ').replace(/\b(\S)/g, (txt) => { return txt.toUpperCase(); }) };
                    const pgs = productClasses[classId].getProductGroups();
                    const groups = {};
                    Object.keys(pgs).forEach(gId => {
                        groups[gId] = {
                            title: gId
                                .replace('-', ' ')
                                .replace(/\b(\S*)/g, (txt) => {
                                    if (txt.startsWith('adam')) {
                                        return 'ADaM' + txt.substring(4);
                                    } else {
                                        return txt.toUpperCase();
                                    }
                                })
                        };
                        const ps = pgs[gId].getProducts();
                        const products = {};
                        Object.keys(ps).forEach(pId => {
                            products[pId] = { title: getProductTitle(pId).replace(/(?:ADaM|SDTM|CDASH|SEND)(?:-IG)? ([a-zA-Z]+.*)/g, '$1') };
                            allProducts[pId] = products[pId];
                        });
                        groups[gId].products = products;
                    });
                    parsedData[classId].groups = groups;
                });
        } else if (productType === 'terminology') {
            panelIds
                .filter(classId => (classId === 'terminology'))
                .forEach(classId => {
                    // Create label from the ID
                    parsedData[classId] = { title: '' };
                    const ctProducts = productClasses.terminology.productGroups.packages.products;
                    // Split groups by model
                    const groups = {};
                    Object.keys(ctProducts).forEach(ctId => {
                        const ctProduct = ctProducts[ctId];
                        let type;
                        if (ctProduct.label.includes('Glossary')) {
                            type = 'GLOSSARY';
                        } else {
                            type = ctProduct.label.replace(/^(\S+).*/, '$1').toUpperCase();
                        }
                        if (groups[type] === undefined) {
                            groups[type] = {
                                title: type,
                                products: {},
                            };
                        }
                        groups[type].products[ctId] = { title: ctProduct.version, type };
                        allProducts[ctId] = groups[type].products[ctId];
                    });
                    parsedData[classId].groups = groups;
                });
        }
        // Add recent only if at least one product is avaialbe
        if (Object.keys(parsedData).length > 0) {
            // Add recent products
            const recent = {
                title: 'Recent',
                groups: { recent: { products: {}, title: '' } },
            };
            if (productType === 'standards') {
                recentStandards.forEach(productId => {
                    recent.groups.recent.products[productId] = allProducts[productId];
                });
            } else {
                recentCt.filter(productId => Object.keys(allProducts).includes(productId)).forEach(productId => {
                    let typeLabel = allProducts[productId].type;
                    if (typeLabel === 'DEFINE-XML') {
                        typeLabel = 'DEF';
                    } else if (typeLabel === 'PROTOCOL') {
                        typeLabel = 'PROT';
                    } else if (typeLabel === 'GLOSSARY') {
                        typeLabel = 'GLOS';
                    }
                    recent.groups.recent.products[productId] = { title: typeLabel + '\n' + allProducts[productId].title };
                });
            }
            parsedData = { recent, ...parsedData };
        }
        const result = Object.keys(parsedData)
        // Show group only if at least one is present
            .filter(panelId => {
                return Object.keys(parsedData[panelId].groups).some(groupId => {
                    return Object.keys(parsedData[panelId].groups[groupId].products).some(productId => {
                        const title = parsedData[panelId].groups[groupId].products[productId].title;
                        if (filterString !== '') {
                            return title.toLowerCase().includes(filterString.toLowerCase());
                        } else {
                            return true;
                        }
                    });
                });
            })
            .map(panelId => {
                return (
                    <List
                        key={panelId}
                        className={classes.classPanel}
                    >
                        <ListItem
                            key={panelId}
                            className={classes.classItem}
                            elevation={12}
                            dense
                            disableGutters
                        >
                            <Grid container>
                                { parsedData[panelId].title !== '' && (
                                    <Grid item ls={12} className={classes.group}>
                                        <Typography variant='h5' color='textSecondary' className={classes.classHeading}>{parsedData[panelId].title}</Typography>
                                    </Grid>
                                )}
                                <Grid item className={classes.group}>
                                    {getGroups(parsedData[panelId].groups, classes)}
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                );
            });
        return (result);
    };

    const lightReloadProducts = async () => {
        setProductClasses({});
        // Reset the library contents
        cdiscLibrary.reset();
        getProductClasses();
    };

    const notLoaded = Object.keys(productClasses).filter(classId => (classId !== 'terminology' && productType === 'standards') || (classId === 'terminology' && productType === 'terminology')).length === 0;

    return (
        <React.Fragment>
            <Grid container justify='space-between' className={classes.main}>
                <Grid item xs={12}>
                    { notLoaded ? (<Loading onRetry={lightReloadProducts} message='API key is required to access CDISC Library API' />) : getClasses(productClasses, classes) }
                </Grid>
            </Grid>
            <BottomBar />
        </React.Fragment>
    );
};

Products.displayName = 'Products';

export default Products;
