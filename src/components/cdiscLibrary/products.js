import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import BottomBar from '../utils/bottombar.js';
import Loading from '../utils/loading.js';
import { CdiscLibraryContext, FilterContext } from '../../constants/contexts.js';
import { getProductTitle } from '../../utils/cdiscLibraryUtils.js';
import { changePage } from '../../redux/slices/ui.js';
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
    const dispatch = useDispatch();
    const cdiscLibrary = useContext(CdiscLibraryContext).cdiscLibrary;
    const { filterString, setFilterString } = useContext(FilterContext);
    const { productType, recentStandards, recentCt } = useSelector(state => state.present.ui.products);
    const classes = getStyles();

    const getProductClasses = useCallback(async () => {
        const productClasses = await cdiscLibrary.getProductClasses();
        const allProducts = {};
        const panelIds = Object.keys(productClasses);
        if (panelIds.length === 0) {
            // Products were not loaded
            return;
        }
        let result = {};
        if (productType === 'standards') {
            panelIds
                .filter(classId => (classId !== 'terminology'))
                .forEach(classId => {
                    // Create label from the ID
                    result[classId] = { title: classId.replace('-', ' ').replace(/\b(\S)/g, (txt) => { return txt.toUpperCase(); }) };
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
                    result[classId].groups = groups;
                });
        } else if (productType === 'terminology') {
            panelIds
                .filter(classId => (classId === 'terminology'))
                .forEach(classId => {
                    // Create label from the ID
                    result[classId] = { title: '' };
                    const ctProducts = productClasses.terminology.productGroups.packages.products;
                    // Split groups by model
                    const groups = {};
                    Object.keys(ctProducts).forEach(ctId => {
                        const ctProduct = ctProducts[ctId];
                        const model = ctProduct.model;
                        if (groups[model] === undefined) {
                            groups[model] = {
                                title: model,
                                products: {},
                            };
                        }
                        groups[model].products[ctId] = { title: ctProduct.version, model };
                        allProducts[ctId] = groups[model].products[ctId];
                    });
                    result[classId].groups = groups;
                });
        }
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
            recentCt.forEach(productId => {
                recent.groups.recent.products[productId] = { title: allProducts[productId].model + '\n' + allProducts[productId].title };
            });
        }
        result = { recent, ...result };
        setProductClasses(result);
    }, [cdiscLibrary, recentStandards, recentCt, productType]);

    useEffect(() => {
        getProductClasses();
    }, [getProductClasses]);

    const selectProduct = (productId, productName) => () => {
        setFilterString('');
        if (productType === 'standards') {
            dispatch(changePage({ page: 'itemGroups', productId }));
        } else if (productType === 'terminology') {
            dispatch(changePage({ page: 'codeLists', productId }));
        }
    };

    const getGroups = (data, classes) => {
        const result = Object.keys(data)
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
        const dataArray = productType === 'standards' ? Object.keys(data) : Object.keys(data).reverse();
        const buttonClass = groupId === 'recent' && productType === 'terminology' ? classes.smallTextButton : classes.button;
        // ADaM 2.1 is intentionally hidden as it is blank
        const result = dataArray
            .filter(id => id !== 'adam-2-1')
            .filter(id => {
                if (filterString !== '') {
                    return data[id].title.toLowerCase().includes(filterString.toLowerCase());
                } else {
                    return true;
                }
            })
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
        return (result);
    };

    const getClasses = (data, classes) => {
        const result = Object.keys(data)
        // Show group only if at least one is present
            .filter(panelId => {
                return Object.keys(data[panelId].groups).some(groupId => {
                    return Object.keys(data[panelId].groups[groupId].products).some(productId => {
                        const title = data[panelId].groups[groupId].products[productId].title;
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
                                { data[panelId].title !== '' && (
                                    <Grid item ls={12} className={classes.group}>
                                        <Typography variant='h5' color='textSecondary' className={classes.classHeading}>{data[panelId].title}</Typography>
                                    </Grid>
                                )}
                                <Grid item className={classes.group}>
                                    {getGroups(data[panelId].groups, classes)}
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                );
            });
        return (result);
    };

    const reloadProducts = async () => {
        setProductClasses({});
        const db = await openDB('cdiscLibrary-store', 1, {
            upgrade (db) {
                // Create a store of objects
                db.createObjectStore('cdiscLibrary', {});
            },
        });

        await db.delete('cdiscLibrary', 'products');
        // Delete all root keys as they can be also updated
        const allKeys = await db.getAllKeys('cdiscLibrary');
        for (let i = 0; i < allKeys.length; i++) {
            const key = allKeys[i];
            if (key.startsWith('r/')) {
                await db.delete('cdiscLibrary', key);
            }
        }

        // Reset the library contents
        cdiscLibrary.reset();

        getProductClasses();
    };

    return (
        <React.Fragment>
            <Grid container spacing={1} justify='space-between' className={classes.main}>
                <Grid item xs={12}>
                    { Object.keys(productClasses).length === 0 ? (<Loading onRetry={reloadProducts} />) : getClasses(productClasses, classes) }
                </Grid>
            </Grid>
            <BottomBar />
        </React.Fragment>
    );
};

Products.displayName = 'Products';

export default Products;
