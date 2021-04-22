import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ButtonBase from '@material-ui/core/ButtonBase';
import { CdiscLibraryContext, FilterContext } from '../../constants/contexts.js';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ItemView from './itemView.js';
import Loading from '../utils/loading.js';
import { changePage } from '../../redux/slices/ui.js';

const getStyles = makeStyles(theme => ({
    longItemGroupButton: {
        height: 40,
    },
    shortItemGroupButton: {
        height: 40,
        width: 64,
    },
    classButton: {
        height: 40,
        width: 260,
        fontWeight: 'bold',
        flexBasis: 'auto',
    },
    classRow: {
        flexBasis: 'auto',
    },
    parentGroup: {
        fontWeight: 'bold',
    },
    childGroup: {
        marginLeft: theme.spacing(3),
    },
    groupDescription: {
        overflow: 'hidden',
        display: 'box',
        lineClamp: 2,
        boxOrient: 'vertical',
    },
    main: {
        outline: 'none',
    },
    itemGroupButton: {
        color: theme.palette.primary.main,
        padding: 0,
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        fontWeight: 500,
        lineHeight: 1.75,
        borderRadius: '4px',
        letterSpacing: '0.02857em',
    },
}));

const ItemGroups = (props) => {
    const [data, setData] = useState({
        product: null,
        itemGroups: [],
    });
    const dispatch = useDispatch();
    const cdiscLibrary = useContext(CdiscLibraryContext).cdiscLibrary;
    const productId = useSelector(state => state.present.ui.itemGroups.productId);
    const gridView = useSelector(state => state.present.settings.cdiscLibrary.itemGroupsGridView);
    const { filterString, setFilterString } = useContext(FilterContext);
    const [openedItemGroupDetails, setOpenedItemGroupDetails] = useState(null);
    const classes = getStyles();

    const getItemGroups = useCallback(async () => {
        const product = await cdiscLibrary.getFullProduct(productId);
        if (typeof product.dataClasses === 'object' && Object.keys(product.dataClasses).length > 0) {
            let itemGroups = [];
            Object.values(product.dataClasses)
                .sort((dc1, dc2) => (dc1.ordinal > dc2.ordinal ? 1 : -1))
                .forEach(dataClass => {
                    const classGroup = {
                        id: dataClass.id,
                        name: dataClass.name,
                        label: dataClass.label,
                    };
                    if (Object.keys(dataClass.getItems({ immediate: true })).length === 0) {
                        classGroup.type = 'headerGroup';
                    } else {
                        classGroup.type = 'parentGroup';
                    }
                    itemGroups.push(classGroup);
                    const classGroups = dataClass.getItemGroups();
                    const childGroups = Object.values(classGroups)
                        .sort((ig1, ig2) => (ig1.name > ig2.name ? 1 : -1))
                        .map(group => {
                            return (
                                {
                                    id: group.id,
                                    name: group.name,
                                    label: group.label,
                                    description: group.description,
                                    type: 'childGroup',
                                    itemNum: Object.keys(group.getItems()).length,
                                }
                            );
                        });
                    if (childGroups.length > 0) {
                        itemGroups = itemGroups.concat(childGroups);
                    }
                });
            setData({ itemGroups, product, type: 'subgroups' });
        } else {
            const itemGroupsRaw = await product.getItemGroups({ type: 'short' });
            if (product.fullyLoaded === true) {
                let itemGroups = Object.values(itemGroupsRaw).sort((ig1, ig2) => (ig1.name > ig2.name ? 1 : -1));
                itemGroups = itemGroups.map(itemGroup => {
                    let repeating;
                    return (
                        {
                            ...itemGroup,
                            id: itemGroup.name,
                            model: product.model,
                            type: 'parentGroup',
                            repeating,
                        }
                    );
                });
                setData({ itemGroups, product });
            }
        }
    }, [cdiscLibrary, productId]);

    useEffect(() => {
        getItemGroups();
    }, [getItemGroups]);

    const selectItemGroup = (itemGroup) => () => {
        if (event.target.id === 'itemGroupButton') {
            // If the button was clicked, open details and not the items
            return;
        }
        setFilterString('');
        if (data.type === 'subgroups') {
            // Get type
            let type;
            let itemGroupId;
            // A simple domain/dataset is an itemGroup
            if (itemGroup.type === 'childGroup') {
                type = 'itemGroup';
                itemGroupId = itemGroup.name;
            } else {
                Object.values(data.product.dataClasses).forEach(dataClass => {
                    if (dataClass.name === itemGroup.name) {
                        type = 'dataClass';
                        itemGroupId = dataClass.id;
                    }
                });
            }

            dispatch(changePage({ page: 'items', itemGroupId, itemType: type, label: itemGroup.name }));
        } else {
            dispatch(changePage({ page: 'items', itemGroupId: itemGroup.name, itemType: 'itemGroup', label: itemGroup.name }));
        }
    };

    const getListClassName = (itemGroup, classes) => {
        if (itemGroup.type === 'parentGroup') {
            return classes.parentGroup;
        } else if (itemGroup.type === 'headerGroup') {
            return classes.parentGroup;
        } else if (itemGroup.type === 'childGroup') {
            return classes.childGroup;
        }
    };

    const getGridClassName = (dataClass, classes) => {
        if (['Relationship', 'Associated Persons'].includes(dataClass.name)) {
            return classes.longItemGroupButton;
        } else {
            return classes.shortItemGroupButton;
        }
    };

    const showGrid = () => {
        // Convert the data to hierarhical structure
        let gridData = [];
        let currentGridItem = {};
        data.itemGroups.forEach(itemGroup => {
            if (itemGroup.type !== 'childGroup') {
                if (Object.keys(currentGridItem).length >= 1) {
                    gridData.push(currentGridItem);
                }
                currentGridItem = { ...itemGroup, childGroups: [] };
            } else {
                currentGridItem.childGroups.push(itemGroup);
            }
        });
        if (Object.keys(currentGridItem).length >= 1) {
            gridData.push(currentGridItem);
        }

        if (filterString !== '') {
            gridData = gridData.filter(dataClass => {
                dataClass.childGroups = dataClass.childGroups.filter(itemGroup => {
                    return itemGroup.name.toLowerCase().includes(filterString.toLowerCase());
                });
                return (dataClass.name.toLowerCase().includes(filterString.toLowerCase()) || dataClass.childGroups.length > 0);
            });
        }

        return gridData.map(dataClass => (
            <Grid container justify='center' alignItems='flex-start' key={dataClass.name}>
                <Grid item xs = {12} className={classes.classRow}>
                    <Button
                        color='primary'
                        size='large'
                        key={dataClass.name}
                        className={classes.classButton}
                        disabled={dataClass.type === 'headerGroup'}
                        onClick={selectItemGroup(dataClass)}
                    >
                        {dataClass.name}
                    </Button>
                </Grid>
                <Grid item xs = {12}>
                    <Grid container justify='flex-start' alignItems='flex-start'>
                        { dataClass.childGroups.map(itemGroup => (
                            <Grid item key={itemGroup.name}>
                                <Button
                                    color='primary'
                                    size='large'
                                    className={getGridClassName(dataClass, classes)}
                                    onClick={selectItemGroup(itemGroup)}
                                >
                                    {itemGroup.name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        ));
    };

    const showItemGroupDetails = (itemGroup) => (event) => {
        event.stopPropagation();
        setOpenedItemGroupDetails(itemGroup);
    };

    const closeItemGroupDetailsView = () => {
        setOpenedItemGroupDetails(null);
    };

    const showList = () => {
        let itemGroups = data.itemGroups.slice();

        if (filterString !== '') {
            itemGroups = itemGroups.filter(row => {
                if (/[A-Z]/.test(filterString)) {
                    return row.name.includes(filterString) || row.label.includes(filterString);
                } else {
                    return row.name.toLowerCase().includes(filterString) || row.label.toLowerCase().includes(filterString);
                }
            });
        }

        return (
            <List>
                {itemGroups.map(itemGroup => (
                    <ListItem
                        button
                        key={itemGroup.name}
                        disabled={itemGroup.type === 'headerGroup'}
                        onClick={selectItemGroup(itemGroup)}
                    >
                        <ListItemText
                            primary={ itemGroup.type === 'childGroup'
                                ? (<ButtonBase
                                    id='itemGroupButton'
                                    onClick={showItemGroupDetails(itemGroup)}
                                    className={classes.itemGroupButton}
                                >
                                    {itemGroup.name}
                                </ButtonBase>)
                                : itemGroup.name
                            }
                            secondary={<span className={classes.groupDescription}>{itemGroup.label}</span>}
                            className={getListClassName(itemGroup, classes)}
                        />
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <React.Fragment>
            <Grid container justify='flex-start' direction='column' wrap='nowrap' className={classes.main}>
                <Grid item>
                    { data.product === null ? (<Loading onRetry={getItemGroups} />) : (gridView ? showGrid() : showList()) }
                </Grid>
            </Grid>
            <SwipeableDrawer
                anchor='bottom'
                open={openedItemGroupDetails !== null}
                onOpen={closeItemGroupDetailsView}
                onClose={closeItemGroupDetailsView}
            >
                <ItemView item={openedItemGroupDetails} type='itemGroup'/>
            </SwipeableDrawer>
        </React.Fragment>
    );
};

export default ItemGroups;
